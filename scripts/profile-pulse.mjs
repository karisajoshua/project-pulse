const owner = process.env.PULSE_OWNER ?? 'karisajoshua'
const token = process.env.GITHUB_TOKEN
const headers = { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', ...(token ? { Authorization: 'Bearer ' + token } : {}) }
async function github(path) { const r = await fetch('https://api.github.com' + path, { headers }); if (!r.ok) throw new Error('GitHub API ' + r.status + ': ' + path); return r.json() }
async function exists(repo, path) { const r = await fetch('https://api.github.com/repos/' + owner + '/' + repo + '/contents/' + path, { headers }); if (r.status === 404) return false; if (!r.ok) throw new Error('GitHub API ' + r.status + ': ' + path); return true }
function level(score) { return score >= 90 ? 'Excellent' : score >= 75 ? 'Healthy' : score >= 50 ? 'Needs attention' : 'Critical' }
async function scoreRepository(repo) {
  const [readme, license, ci, security, contributing] = await Promise.all(['README.md','LICENSE','.github/workflows','SECURITY.md','CONTRIBUTING.md'].map(p => exists(repo.name,p)))
  const recent = !repo.archived && Date.now() - new Date(repo.pushed_at).getTime() <= 180 * 86400000
  const raw = (readme?15:0)+(license?10:0)+(ci?20:0)+(security?10:0)+(contributing?10:0)+(recent?15:0)
  const score = Math.round(raw / 80 * 100)
  return { name: repo.name, score, level: level(score) }
}
const repos=[]; for(let page=1;;page++){const batch=await github('/users/'+owner+'/repos?type=owner&sort=updated&per_page=100&page='+page);repos.push(...batch);if(batch.length<100)break}
const scored=await Promise.all(repos.filter(r=>!r.fork&&!r.archived).map(scoreRepository)); scored.sort((a,b)=>b.score-a.score||a.name.localeCompare(b.name))
const average=scored.length?Math.round(scored.reduce((s,r)=>s+r.score,0)/scored.length):0
const counts={excellent:scored.filter(r=>r.score>=90).length,healthy:scored.filter(r=>r.score>=75&&r.score<90).length,attention:scored.filter(r=>r.score>=50&&r.score<75).length,critical:scored.filter(r=>r.score<50).length}
const wanted=['codesentryx','project-pulse','sprints','symbiont','africa-vision-workspace']
const featured=wanted.map(n=>scored.find(r=>r.name.toLowerCase()===n)).filter(Boolean)
const rows=featured.map(r=>'| ['+r.name+'](https://github.com/'+owner+'/'+r.name+') | **'+r.score+'/100** | '+r.level+' |').join('\n')
const stamp=new Date().toISOString().slice(0,10)
const block=['<!-- PROJECT-PULSE:START -->','> Automated, read-only repository-health snapshot powered by [ProjectPulse](https://github.com/'+owner+'/project-pulse).','','**'+scored.length+'** maintained public repositories · **'+average+'/100** average observable health · **'+counts.excellent+'** excellent · **'+counts.healthy+'** healthy · **'+counts.attention+'** need attention · **'+counts.critical+'** critical','','| Repository | Health | Status |','| --- | ---: | --- |',rows || '| No featured repositories available | — | — |','', '<sub>Observable profile score covers documentation, licensing, CI, security policy, contribution guidance and recent maintenance. It does not execute repository code. Updated '+stamp+' UTC.</sub>','<!-- PROJECT-PULSE:END -->'].join('\n')
process.stdout.write(block)
