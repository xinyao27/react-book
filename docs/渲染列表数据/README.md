# 渲染列表数据

## 前言

在 组件的组合、嵌套和组件树 章节内我们实现过一个组件 `WeatherDetails` ：
```js
class WeatherDetails extends React.Component {
  render() {
    return (
      <div className="WeatherDetails">
        <Details />
        <Details />
        <Details />
        <Details />
        <Details />
        <Details />
        <Details />
        <Details />
      </div>
    );
  }
}
```
可以看出这里我们连续写了8个 `Details` 组件才达到了一个列表的效果，这种写法肯定是不合适的，这一节我们了解一下怎么优化写法。

## 前置知识

我们说过 JSX 中，`{}` 内可放任何 JavaScript 表达式，当然放一个数组也是可以的。

```js
function Demo() {
  const components = [
    <li>list 1</li>,
    <li>list 2</li>,
    <li>list 3</li>,
  ];
  return (
    <ul>
      {components}
    </ul>
  );
}
```
我们在数组内插入了几个 JSX 元素，是可以正常渲染的：

![map.png](https://i.loli.net/2018/12/15/5c14f5caa8824.png)

但是控制台却出现了 warning ：
```
Warning: Each child in an array or iterator should have a unique "key" prop.
```
数组或迭代器内每个子元素都必须有 prop 属性："key"。

这是为什么呢？

简单点讲，React 内每次状态变更导致需要更新 Dom 元素时，React 只会去更新需要变更的 Dom 元素，对于没有变化的元素绝对不会动。

回到我们上述的例子，当我们需要将数组内 `list 1` 和 `list2` 元素调换位置时，React 会认为他们是分别改变了自己而不是仅仅调换位置，从而导致 React 将两个元素重新渲染，这样无疑加大了 Dom 操作成本。

怎么解决呢？我们给数组内的每一个元素加一个 prop: key，并且保证每个元素的 key 都是自己独有的（就像给每个元素一个身份证）这样 React 就可以根据 key 知道二者仅仅是调换了位置。

## 实战

TODO