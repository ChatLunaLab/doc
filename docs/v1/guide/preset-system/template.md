# 渲染模板

ChatLuna 预设系统采用类 JavaScript 的模板语法，支持变量插值、函数调用、条件判断和循环控制。

:::tip pre
旧版语法（`{func:arg1::arg2}`）已废弃。如需迁移旧版预设，请参阅 [从旧语法迁移](#从旧语法迁移) 一节。
:::

## 变量插值

### 基本插值

使用花括号 `{}` 引用变量。变量会在渲染时被替换为其对应的值。

```yml
content: "你好，{name}！"
```

如果 `name` 的值为 `"小助手"`，则渲染结果为：

```text
你好，小助手！
```

### 成员访问

使用点号 `.` 访问对象的属性。支持多级属性访问。

```yml
content: "用户：{user.name}，年龄：{user.age}"
```

对于嵌套对象：

```yml
content: "城市：{user.profile.city}"
```

### 数组索引

使用方括号 `[]` 访问数组元素。索引从 0 开始计数。

```yml
content: "第一项：{items[0]}，第二项：{items[1]}"
```

支持多维数组：

```yml
content: "{matrix[0][1]}"
```

## 函数调用

### 基本调用

函数调用使用圆括号，多个参数用逗号分隔。所有函数必须由系统预先注册后才能使用。

```yml
content: "{upper(name)}"
```

对于无参数的函数，括号可以省略：

```yml
content: "当前时间：{date}"
```

### 参数类型

函数参数可以是字符串字面量、变量或表达式。

字符串字面量**需要使用引号**：

```yml
content: "{concat('Hello', 'World')}"
```

变量不需要引号：

```ts
content: "{concat(greeting, name)}"
```

混合使用：

```yml
content: "{concat('Hello, ', name, '!')}"
```

### 链式调用

函数返回的对象可以继续访问其成员或调用其方法。

```yml
content: "{getUser().name}"
content: "{getData().items[0]}"
```

### 嵌套调用

函数调用可以嵌套，内层函数的返回值会作为外层函数的参数。

```yml
content: "{upper(concat('hello', ' ', name))}"
```

执行顺序为由内向外：先执行 `concat`，再将结果传递给 `upper`。

## 运算符

模板语法支持常见的算术、比较和逻辑运算符。运算符的优先级和结合性与 JavaScript 保持一致。

### 算术运算符

```js
{a + b}     // 加法
{a - b}     // 减法
{a * b}     // 乘法
{a / b}     // 除法
{a % b}     // 取模（求余数）
```

示例：

```yml
content: "总价：{price * quantity}"
```

### 比较运算符

```js
{a == b}    // 相等
{a != b}    // 不相等
{a > b}     // 大于
{a < b}     // 小于
{a >= b}    // 大于等于
{a <= b}    // 小于等于
```

比较运算符返回布尔值，常用于条件判断。

### 逻辑运算符

```js
{a && b}    // 逻辑与（两者都为真时返回真）
{a || b}    // 逻辑或（至少一个为真时返回真）
{!a}        // 逻辑非（取反）
```

逻辑运算符支持短路求值。

### 三元运算符

三元运算符提供简洁的条件表达式。

```js
{condition ? valueIfTrue : valueIfFalse}
```

示例：

```yml
content: "状态：{age >= 18 ? '成年' : '未成年'}"
```

当 `age` 为 20 时，渲染结果为：

```text
状态：成年
```

## 控制流

### 条件语句

条件语句根据表达式的值决定是否渲染某段内容。

#### if 语句

<span v-pre>最简单的条件语句形式。当条件为真时，渲染 `{if\}` 和 `{/if}` 之间的内容。</span>

```js
{if condition}
  content
{/if}
```

示例：

```yml
content: |-
  你好！{if loggedIn}欢迎回来，{username}！{/if}
```

#### if-else 语句

提供两个分支，根据条件选择其中一个渲染。

```js
{if condition}
  content when true
{else}
  content when false
{/if}
```

示例：

```yml
content: |-
  {if is_group}
    当前在群聊中
  {else}
    当前在私聊中
  {/if}
```

#### if-elseif-else 语句

支持多个条件分支。条件从上到下依次检查，执行第一个为真的分支。如果所有条件都不满足，执行 `{else}` 分支（如果存在）。

```js
{if condition1}
  content1
{elseif condition2}
  content2
{elseif condition3}
  content3
{else}
  default content
{/if}
```

示例：

```yml
content: |-
  成绩评级：
  {if score >= 90}
    优秀
  {elseif score >= 80}
    良好
  {elseif score >= 60}
    及格
  {else}
    不及格
  {/if}
```

### 循环语句

循环语句用于重复渲染内容。

#### for 循环

`for` 循环用于遍历数组中的每个元素。

```js
{for item in array}
  content
{/for}
```

在循环体中，`item` 变量会依次绑定到数组的每个元素。

示例：

```yml
content: |-
  成员列表：
  {for name in names}
  - {name}
  {/for}
```

如果 `names` 为 `["Alice", "Bob", "Charlie"]`，渲染结果为：

```text
成员列表：
- Alice
- Bob
- Charlie
```

##### 嵌套循环

`for` 循环可以嵌套使用。

```yml
content: |-
  {for row in matrix}
    {for cell in row}
      {cell}
    {/for}
  {/for}
```

#### while 循环

`while` 循环在条件为真时持续执行。为了防止无限循环，最大迭代次数限制为 10000 次。

```js
{while condition}
  content
{/while}
```

:::warning 注意
确保循环条件最终会变为假，否则会达到迭代次数限制。
:::

#### repeat 循环

`repeat` 循环重复执行固定次数。

```lua
{repeat count}
  content
{/repeat}
```

`count` 必须是非负整数。如果 `count` 不是有效数字或小于 0，循环会被跳过并在控制台输出警告。

示例：

```yml
content: "{repeat 3}Hello {/repeat}"
```

渲染结果为：

```text
Hello Hello Hello
```

使用变量：

```yml
content: "{repeat count}* {/repeat}"
```

如果 `count` 的值为 5，渲染结果为：

```c
* * * * *
```

## 转义

如果需要在模板中输出花括号本身（而非触发模板语法），使用双花括号进行转义。

- <span v-pre>`{{` 输出字符 `{` </span>
- <span v-pre>`}}` 输出字符 `}`</span>

示例：

```yml
content: "模板语法：{{variable}}"
```

渲染结果为：

```bash
模板语法：{variable}
```

对于包含花括号的 JSON 或代码示例，这一特性尤其有用：

```yml
content: "JSON 格式：{{ \"key\": \"value\" }}"
```

## 从旧语法迁移

旧版 ChatLuna 预设使用冒号（`:`）和双冒号（`::`）分隔函数名和参数。

新版本采用更接近 JavaScript 的函数调用语法，拥有更好的可读性和更强的表达能力。

| 特性 | 旧语法 | 新语法 | 说明 |
|------|--------|--------|------|
| 单参数函数 | `{func:arg}` | `{func(arg)}` | 使用圆括号 |
| 多参数函数 | `{func:arg1::arg2}` | `{func(arg1, arg2)}` | 参数用逗号分隔 |
| 字符串参数 | `{func:Hello}` | `{func('Hello')}` | **字符串需要添加引号** |
| 混合参数 | `{concat:Hello::name}` | `{concat('Hello', name)}` | 字符串需要加引号，引用变量不需要加 |
| 对象成员访问 | 不支持 | `{user.name}` | 新增功能 |
| 数组索引 | 不支持 | `{arr[0]}` | 新增功能 |
| 条件语句 | 不支持 | `{if x}...{/if}` | 新增功能 |
| 循环语句 | 不支持 | `{for x in arr}...{/for}` | 新增功能 |
| 嵌套函数调用 | 不支持 | `{upper(concat(a, b))}` | 新增功能 |
