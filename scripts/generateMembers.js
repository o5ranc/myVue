const fs = require('fs')
const path = require('path')

const departments = ['개발팀', '디자인팀', '마케팅팀', '영업팀', '인사팀', '경영지원팀']
const firstNames = ['김', '이', '박', '최', '정', '강', '조', '윤', '장', '임']
const lastNames = ['영희', '철수', '민수', '지민', '서연', '준호', '민지', '현우', '수진', '태호']

const members = Array.from({ length: 300 }, (_, index) => {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
  const name = firstName + lastName
  const department = departments[Math.floor(Math.random() * departments.length)]

  return {
    id: index + 1,
    name,
    email: `${name}${index + 1}@example.com`,
    department,
  }
})

const data = { members }
const outputPath = path.join(__dirname, '..', 'src', 'data', 'members.json')

fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf8')
console.log('Generated 300 members in members.json')
