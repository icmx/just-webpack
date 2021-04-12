import { Component } from '~/app/component';

import '~/index.css';

const instance = Component('Example component');

console.log(`Main ready.`);
console.log(`${instance.name} ready.`);
