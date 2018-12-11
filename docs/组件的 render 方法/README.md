# 组件的 render 方法

## 前言

在上一节 JSX 基本语法 中，我们都是通过箭头函数返回 JSX 的方式创建组件。从这一节开始，我们使用另外一种方式：继承 `React.Component` 类 来创建组件。
```js
class App extends React.Component {
  render() {
    const color = 'blue';
    return (
      <div>{color}</div>
    );
  }
}
```

### 条件渲染

在实际工作场景中，我们不可避免的会遇到不同条件显示不同内容的需求，此时使用条件渲染的方式最适合不过。

#### if/else

最简单的，我们可以在 `render` 方法内写 `if/else` `return` 不同内容满足需求：
```js
class App extends React.Component {
  render() {
    const mode = 'view1';
    if (mode === 'view1') {
      return (
        <div>view1</div>
      );
    } else {
      return (
        <div>view2</div>
      );
    }
  }
}
```
当然我们不推荐使用这种方式，逻辑复杂时这种方式实在过于臃肿。

#### 三元运算符

上一节我们说过，`{}` 内可以写任何 JavaScript 表达式，所以我们可以通过三元运算符来优化上边的代码：
```js
class App extends React.Component {
  render() {
    const mode = 'view1';
    return (
      <div>{mode === 'view1' ? 'view1' : 'view2'}</div>
    );
  }
}
```

#### 短路运算符

我们变更一点需求，要求满足 `mode === 'view1'` 时渲染 `view1`

如果使用三元运算符：
```js
class App extends React.Component {
  render() {
    const mode = 'view1';
    return (
      <div>
        {
          mode === 'view1'
            ? <div>view1</div>
            : null
        }
      </div>
    );
  }
}
```
上面的代码如果使用短路运算符可优化为：
```js
class App extends React.Component {
  render() {
    const mode = 'view1';
    return (
      <div>
        {
          mode === 'view1' && <div>view1</div>
        }
      </div>
    );
  }
}
```

#### 自执行函数

如果你遇到了多层嵌套的三元运算符，例如：
```js
const mode = 1;
return (
  <div>
    { mode === 1
      ? <Component1 />
      : ( mode === 2
        ? <Component2 />
        : ( mode === 3
          ? <Component3 />
          : <Component4 />
        )
      )
    }
  </div>
);
```
那么你已经进入到了嵌套地狱当中，也许你需要使用自执行函数缕清你的代码：
```js
const mode = 1;
return (
  <div>
    {
     (() => {
       switch (mode) {
         case 1:
           return <Component1 />;
         case 2:
           return <Component2 />;
         case 3:
           return <Component3 />;
         case 4:
           return <Component4 />;
         default:
           return null;
       }
     })()
    }
  </div>
);
```
虽然这种方式可用，但是我们还是需要反思为什么会出现如此复杂的逻辑判断。
也许我们可以将复杂的逻辑进行拆分，并将拆分后的逻辑写在各自的组件内，最后将各个组件组合起来。
下一节我们探索组件之间的组合嵌套。

## 实战

我们已经了解了 React.js 基本环境安装以及 JSX 相关内容。从本章开始，我们将从零实现一个 `天气预报 app`，从中体会 `React` 的魅力所在。

首先我们使用 `create-react-app` 工具生成项目。

打开 `App.js` ，写入以下代码：
```js
import React from 'react';
import './style.css';

const App = () => (
  <div className="RealTime">
    <div className="temp">-2°</div>
    <div className="weather">晴</div>
    <div className="wind">北风 2级</div>
    <div className="humidity">66%</div>
  </div>
);

export default App;
```
我们可以直接通过 `import './style.css'` 引入样式。

现在我们的项目变成了这样。
![RealTime.png](https://i.loli.net/2018/12/11/5c0fc4b95de4d.png)