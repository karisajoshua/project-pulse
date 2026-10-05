#!/usr/bin/env node
import { calculateRepositoryHealth } from './scoring.js'
import { createReport } from './report.js'
import type { RepositorySignals } from './types.js'

function usage(): never {
  console.error('Usage: project-pulse --repository owner/repo --signals <signals.json> [--pretty]')
  process.exit(2)
}
const args=process.argv.slice(2)
const value=(flag:string)=>{const i=args.indexOf(flag); return i>=0?args[i+1]:undefined}
const repository=value('--repository')
const signalsPath=value('--signals')
if(!repository||!signalsPath) usage()
const { readFile }=await import('node:fs/promises')
const signals=JSON.parse(await readFile(signalsPath,'utf8')) as RepositorySignals
const report=createReport(repository,calculateRepositoryHealth(signals))
process.stdout.write(JSON.stringify(report,null,args.includes('--pretty')?2:0)+'\n')
