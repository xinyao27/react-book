# JSX 基本语法

## 前言

你一定听说过一句话：*React 中一切皆为组件*。
在这之前，我们通过直接写 `HTML` 描述渲染内容，现在在 React 中，我们通过写 `JSX` 来描述渲染内容。

## 基本语法

我们写一个组件
```js
const List = () => (
  <ul>
    <li>小胖子1</li>
    <li>小胖子2</li>
    <li>小胖子3</li>
  </ul>
);
```
我们写了一个箭头函数，与以往不同的是，箭头函数返回一段 JSX。现在我们就可以把 List 称作一个 React 组件。

注意：
- 返回的 JSX 必须由一个标签包裹(React 16 引入了[Fragment](https://reactjs.org/docs/fragments.html)，此处不再拓展)。例如 `const List = () => <div>test</div><div>test</div>`就会报错
- 标签必须闭合。
- 组件名首字母大写，用于区分 DOM 元素与组件元素。

### 使用表达式

我们说`JSX` 看起来像 `HTML`，却比 `HTML` 灵活，归功于可以在 `JSX` 内插入 JavaScript 表达式(表达式使用 `{}` 包裹)。
```js
const App = () => {
  const color = 'blue';
  return (
    <div>{color}</div>
  );
};
```
当然不仅是变量，`{}` 内可以放任何 JavaScript 表达式，例如：
```js
const App = () => {
  const color = 'blue';
  return (
    <div>
      <div>{color}</div>
      <div>{1 + 1}</div>
      <div>{new Date().getTime()}</div>
      <div>{(() => 'react')()}</div>
    </div>
  );
};
```

### 元素属性

除了标签的内容可以用表达式，标签的属性同样可以使用表达式，但是有两个例外 —— class 和 for，因为这两个属性均为 JavaScript 的关键词，我们可以这样转换：
- class 改为 className
- for 改为 htmlFor

例如：
```js
const App = () => {
  const color = 'blue';
  return (
    <div className={color}>hello</div>
  );
};
```

#### Boolean 属性

一些常用的属性例如 disabled checked 等，我们可以省略值来表示为 true。
`<input disabled />` 就等同于 `<input disabled={true} />`

#### 使用 ES6 rest

我们可以直接将一个 JavaScript 对象里的属性作为元素的属性合并，使用 ES6 的 rest 特性。
```js
const App = () => {
  const props = {
    className: 'app',
    id: 'app',
    'data-root': 'root',
  };
  return (
    <div {...props}>hello</div>
  );
};
```
渲染的 DOM ：
![rest.png](https://i.loli.net/2018/12/11/5c0fa401e0384.png)

## 最后

我们已经了解了 JSX 的灵活特性，接下来我们将使用 JSX 创建组件并加以使用，了解 React 的强大之处。