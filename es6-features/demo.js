// ES6+ Features 入門範例
// 執行方式：node demo.js

'use strict';

// ─────────────────────────────────────────────
// 1. let / const 與 block scope
// ─────────────────────────────────────────────
{
  let count = 1;
  const PI = 3.14159;
  if (true) {
    let count = 2; // 不同 scope，不影響外層
    console.log('block 內 count =', count); // 2
  }
  console.log('block 外 count =', count); // 1
  console.log('PI =', PI);
}

// ─────────────────────────────────────────────
// 2. 箭頭函式（Arrow Functions）
// ─────────────────────────────────────────────
const add = (a, b) => a + b;
const square = (n) => n * n;
const nums = [1, 2, 3].map((x) => x * 2);
console.log('add(2,3) =', add(2, 3));
console.log('square(4) =', square(4));
console.log('map x2 =', nums);

// ─────────────────────────────────────────────
// 3. 解構賦值（Destructuring）
// ─────────────────────────────────────────────
const user = { name: 'Ian', age: 30, city: 'Taipei' };
const { name, age, city = 'Unknown' } = user;
console.log('解構物件：', name, age, city);

const [first, second, ...rest] = [10, 20, 30, 40];
console.log('解構陣列：', first, second, rest);

// ─────────────────────────────────────────────
// 4. 展開運算子（Spread）/ 其餘運算子（Rest）
// ─────────────────────────────────────────────
const arr1 = [1, 2];
const arr2 = [...arr1, 3, 4]; // spread 展開
console.log('spread 合併陣列：', arr2);

function sumAll(...nums) {
  // rest 收集為陣列
  return nums.reduce((acc, n) => acc + n, 0);
}
console.log('sumAll(1,2,3,4) =', sumAll(1, 2, 3, 4));

// ─────────────────────────────────────────────
// 5. 模板字串（Template Literals）
// ─────────────────────────────────────────────
const greeting = `你好，${name}！你今年 ${age} 歲，住在 ${city}。`;
console.log(greeting);

// ─────────────────────────────────────────────
// 6. 類別（Class）語法
// ─────────────────────────────────────────────
class Animal {
  constructor(name) {
    this.name = name;
  }
  speak() {
    return `${this.name} 發出聲音`;
  }
}
class Dog extends Animal {
  speak() {
    return `${this.name} 汪汪叫`;
  }
}
const dog = new Dog('小白');
console.log(dog.speak());

// ─────────────────────────────────────────────
// 7. 可選鏈（Optional Chaining ?.）與空值合併（??）
// ─────────────────────────────────────────────
const data = { user: { profile: null } };
const nickname = data?.user?.profile?.nickname; // 不會 throw，回傳 undefined
const display = nickname ?? '匿名'; // undefined/null 才用預設值
console.log('可選鏈 + 空值合併：', display);

// ─────────────────────────────────────────────
// 8. Symbol 與 Iterator
// ─────────────────────────────────────────────
const uniqueId = Symbol('id');
const obj = { [uniqueId]: 123 };
console.log('Symbol 值：', obj[uniqueId]);

// 自訂可迭代物件
const range = {
  from: 1,
  to: 5,
  [Symbol.iterator]() {
    let current = this.from;
    const last = this.to;
    return {
      next() {
        return current <= last
          ? { value: current++, done: false }
          : { value: undefined, done: true };
      },
    };
  },
};
console.log('自訂迭代器：', [...range]);

// ─────────────────────────────────────────────
// 9. Generator 函式
// ─────────────────────────────────────────────
function* idGenerator() {
  let id = 1;
  while (true) {
    yield id++;
  }
}
const gen = idGenerator();
console.log('Generator 依序取值：', gen.next().value, gen.next().value, gen.next().value);

console.log('\n✅ ES6+ 範例執行完畢');