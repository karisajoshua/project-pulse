const owner = process.env.PULSE_OWNER ?? 'karisajoshua'
const token = process.env.GITHUB_TOKEN
const credentialMode = process.env.PULSE_CREDENTIAL_MODE ?? 'repository-token'
const headers = { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', ...(token ? { Authorization: 'Bearer ' + token } : {}) }
async function github(path) { const r = await fetch('https://api.github.com' + path, { headers }); if (!r.ok) throw new Error('GitHub API ' + r.status + ': ' + path); return r.json() }
async function exists(repo, path) { const r = await fetch('https://api.github.com/repos/' + repo.full_name + '/contents/' + path, { headers }); if (r.status === 404) return false; if (!r.ok) throw new Error('GitHub API ' + r.status + ': ' + repo.full_name + '/' + path); return true }
function level(score) { return score >= 90 ? 'Excellent' : score >= 75 ? 'Healthy' : score >= 50 ? 'Needs attention' : 'Critical' }
async function scoreRepository(repo) {
  const [readme, license, ci, security, contributing] = await Promise.all(['README.md','LICENSE','.github/workflows','SECURITY.md','CONTRIBUTING.md'].map(p => exists(repo,p)))
  const recent = !repo.archived && Date.now() - new Date(repo.pushed_at).getTime() <= 180 * 86400000
  const raw = (readme?15:0)+(license?10:0)+(ci?20:0)+(security?10:0)+(contributing?10:0)+(recent?15:0)
  const score = Math.round(raw / 80 * 100)
  return { name: repo.name, fullName: repo.full_name, private: repo.private === true, score, level: level(score) }
}
async function collectRepos() {
  const repos=[]
  for(let page=1;;page++){
    const path = token ? '/user/repos?affiliation=owner&visibility=all&sort=updated&per_page=100&page='+page : '/users/'+owner+'/repos?type=owner&sort=updated&per_page=100&page='+page
    const batch=await github(path); repos.push(...batch); if(batch.length<100) break
  }
  return repos.filter(r => r.owner?.login?.toLowerCase() === owner.toLowerCase())
}
const repos=await collectRepos()
const scored=await Promise.all(repos.filter(r=>!r.fork&&!r.archived).map(scoreRepository)); scored.sort((a,b)=>b.score-a.score||a.name.localeCompare(b.name))
const publicRepos=scored.filter(r=>!r.private), privateRepos=scored.filter(r=>r.private)
const average=scored.length?Math.round(scored.reduce((s,r)=>s+r.score,0)/scored.length):0
const publicAverage=publicRepos.length?Math.round(publicRepos.reduce((s,r)=>s+r.score,0)/publicRepos.length):0
const counts={excellent:scored.filter(r=>r.score>=90).length,healthy:scored.filter(r=>r.score>=75&&r.score<90).length,attention:scored.filter(r=>r.score>=50&&r.score<75).length,critical:scored.filter(r=>r.score<50).length}
const wanted=['codesentryx','project-pulse','sprints','symbiont','africa-vision-workspace']
const featured=wanted.map(n=>publicRepos.find(r=>r.name.toLowerCase()===n)).filter(Boolean)
const rows=featured.map(r=>'| ['+r.name+'](https://github.com/'+r.fullName+') | **'+r.score+'/100** | '+r.level+' |').join('\n')
const stamp=new Date().toISOString().slice(0,10)
const privateAccess = privateRepos.length > 0
const botStatus = privateAccess ? 'Operational — public + private aggregation enabled' : (credentialMode === 'account-token' ? 'Authorization warning — account credential returned no private repositories' : 'Public-only — account-level private access is not configured')
const privacyNote=privateAccess ? 'Private repositories contribute only to aggregate counts and the combined score; names and individual private scores are never published.' : 'Private repository identities are never published. Account-level authorization is required for private aggregation.'
const block=['<!-- PROJECT-PULSE:START -->','> Automated, read-only repository-health snapshot powered by [ProjectPulse](https://github.com/'+owner+'/project-pulse).','','**Bot status:** '+botStatus+'\n\n**'+scored.length+'** maintained repositories · **'+publicRepos.length+' public** · **'+privateRepos.length+' private** · **'+average+'/100** combined observable health','','Portfolio distribution: **'+counts.excellent+'** excellent · **'+counts.healthy+'** healthy · **'+counts.attention+'** need attention · **'+counts.critical+'** critical · Public-only average: **'+publicAverage+'/100**','','| Public repository | Health | Status |','| --- | ---: | --- |',rows || '| No featured public repositories available | — | — |','', '<sub>'+privacyNote+' Observable score covers documentation, licensing, CI, security policy, contribution guidance and recent maintenance. It does not execute repository code. Updated '+stamp+' UTC.</sub>','<!-- PROJECT-PULSE:END -->'].join('\n')
process.stdout.write(block)
