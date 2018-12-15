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



## propTypes