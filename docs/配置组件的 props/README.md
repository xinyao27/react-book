# 配置组件的 props

## props

props 是 properties 的缩写，它与 state 的地位不分上下。

我们一定会遇到组件之间相互通信的需求，就像方法的参数一样，我们会根据参数进行操作达成某些需求，props 就可以简单的理解为组件的参数。

### 基础用法

在函数式组件内 props 可以这样用：
```js
function Demo(props) {
  const { name } = props;
  return (
    <div>hello {name}</div>
  );
}

// 调用
<Demo name="cxy" />
```
在 `class component` 内使用：
```js
class Demo extends React.Component {
  render() {
    const { name } = this.props;
    return (
      <div>hello {name}</div>
    );
  }
}

// 调用
<Demo name="cxy" />
```

我们可以往组件的 props 内传入任何类型的参数，例如：
```js
class Button extends React.Component {
  render() {
    const { say } = this.props;
    return (
      <button onClick={say}>btn</button>
    );
  }
}

<Button say={() => console.log('hello')} />
```
甚至可以传入 JSX：
```js
class Button extends React.Component {
  render() {
    return this.props.render;
  }
}

<Button render={<button>btns</button>} />
```

### props.children

`props.children` 是 React 内置的 prop，它代表组件的子组件的集合。
React 为 children 设计了一个非常巧妙的语法糖：
```js
class Button extends React.Component {
  render() {
    const { children } = this.props;
    return (
      <button>{children}</button>
    );
  }
}

<Button>我是 children</Button>
// 等同于
<Button children={'我是 children'}/>
```

### props 不可变

这里的不可变是指组件内部不可修改传入的 props，如：`this.props.name = 'frank'` （React: 你敢改我就敢报错）。

如同 state 一样，永远不要直接修改 props，因为 React 并不知道如何处理直接修改后的 props。

当然修改还是需要的，不可以在组件内修改 props，我们可以更改传入的 props，这样组件接受到了新的 props 后就可以主动渲染。

## defaultProps

我们写函数时，经常会给参数加默认值，同样地 React 也给 props 提供了默认配置：通过定义静态变量 defaultProps 的方式定义。

```js
class Demo extends React.Component {
  static defaultProps = {
    name: 'cxy'
  }

  render() {
    return (
      <div>{this.props.name}</div>
    )
  }
}

<Demo />
```
上例中我们调用 Demo 组件却没有传入 name，此时会直接使用 `defaultProps` 中的默认属性，从而保证了渲染后始终有值。

## propTypes

propTypes 用来记录传递给组件的预期属性类型。

在开发环境下 React 将会根据定义的 propTypes 检查传递给组件的 props，如果不匹配，将在控制台内 warning，在生产环境下则不进行检查。

###  Importing

React 16 以前：
```js
import React, { PropTypes } from 'react';
```
从 React 16 开始，PropTypes 被放在一个独立的npm包 [prop-types](https://github.com/facebook/prop-types) 里。

在 React 16 以后的项目内，需要单独安装 `prop-types`：
```
npm install --save prop-types
```
import：
```js
import PropTypes from 'prop-types';
```

### 定义 propTypes

我们这里列举一些常用的 propTypes
```js
import PropTypes from 'prop-types';

class Demo extends React.Component {
  static propTypes = {
    optionalArray: PropTypes.array,
    optionalBool: PropTypes.bool,
    optionalFunc: PropTypes.func,
    optionalNumber: PropTypes.number,
    optionalObject: PropTypes.object,
    optionalString: PropTypes.string,
    optionalSymbol: PropTypes.symbol,
    optionalAny: PropTypes.any,
    optionalRequired: PropTypes.any.isRequired,
  }

  // ...
}
```
当然除了上述基本类型以外，`prop-types` 还支持枚举类型和自定义类型等，有兴趣的可自行了解。
