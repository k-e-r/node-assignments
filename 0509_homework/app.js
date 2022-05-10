// 2-b
const mySum = require('./mySum');
console.log(mySum(1, 2, 3, 1));

// 2-c
const myArr = [1, 2, 3];
// 2-d
const result = mySum(...myArr);
console.log(result);

// 2-e
const mySecondArr = myArr.map((val) => val * 2);
// 2-f
const ave = mySum(...mySecondArr) / mySecondArr.length;
console.log(mySecondArr.filter((val) => val >= ave));

// 2-g
setTimeout(() => console.log('Goodbye'), 3000);

// 2-h
const Employee = {
  name: 'hoge',
  email: 'test',
  department: 'test',
  startDate: 'today',
};

// 2-i
const Person = new Object();
Person.name = Employee.name;
Person.email = Employee.email;
// const { department, startDate, ...Person } = Employee;

console.log(Person);
