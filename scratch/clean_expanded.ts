import fs from 'fs'
import { expandedContent } from '../prisma/data/expanded_data.ts'

const duplicateSlugs = new Set([
  "rrr-2022",
  "the-rajasaab-2026",
  "pushpa-2-the-rule-2024",
  "salaar-part-1-ceasefire-2023",
  "kalki-2898-ad-2024",
  "b-hubali-2-the-conclusion-2017",
  "pushpa-the-rise-2021",
  "b-hubali-the-beginning-2015",
  "ala-vaikunthapurramuloo-2020",
  "leo-2023",
  "coolie-2025",
  "vikram-2022",
  "interstellar-2014",
  "avengers-infinity-war-2018",
  "the-avengers-2012",
  "the-dark-knight-2008",
  "spider-man-no-way-home-2021",
  "deadpool-wolverine-2024",
  "jujutsu-kaisen-2020",
  "doraemon-2005",
  "pok-mon-1997",
  "naruto-2002",
  "naruto-shipp-den-2007",
  "spy-x-family-2022",
  "solo-leveling-2024",
  "one-piece-1999",
  "attack-on-titan-2013",
  "chainsaw-man-2022",
  "all-of-us-are-dead-2022",
  "true-beauty-2020",
  "the-tom-and-jerry-show-2014",
  "the-powerpuff-girls-1998"
])

const cleaned = expandedContent.filter(item => !duplicateSlugs.has(item.slug))

const code = `export const expandedContent = ${JSON.stringify(cleaned, null, 2)}`
fs.writeFileSync('prisma/data/expanded_data.ts', code, 'utf-8')
console.log(`Cleaned expanded_data.ts. Remaining items: ${cleaned.length}`)
