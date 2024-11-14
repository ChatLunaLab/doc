<script setup>
import { VPTeamMembers, VPTeamPageSection, VPSponsors } from 'vitepress/theme'

const thinks = [
    {
        img: "https://q1.qlogo.cn/g?b=qq&nk=766949709&s=0",
        name: "EF台风",
        url: "#EF台风",
    },
    {
        img: "https://q1.qlogo.cn/g?b=qq&nk=2371124484&s=0",
        name: "TR0MX",
        url: "#TR0MX",
    },
    {
        img: "https://q1.qlogo.cn/g?b=qq&nk=52473342&s=0",
        name: "僵尸尸",
        url: "#僵尸尸",
    },
    {
        img: "https://q1.qlogo.cn/g?b=qq&nk=3373167460&s=0",
        name: "Nawyjx",
        url: "#Nawyjx",
    },
    {
        img: "https://q1.qlogo.cn/g?b=qq&nk=3283406743&s=0",
        name: "Ling",
        url: "#Ling",
    },
    {
        img: "https://q1.qlogo.cn/g?b=qq&nk=1919892171&s=0",
        name: "上学",
        url: "#上学",
    },
    {
        img: "https://q1.qlogo.cn/g?b=qq&nk=503753255&s=0",
        name: "飞@^O^",
        url: "#飞@^O^",
    },
    {
        img: "https://pic1.afdiancdn.com/user/979158d0e7d211ec95c152540025c377/avatar/d5573d81cfda4cc36f4cda19a264b02c_w640_h640_s16.jpeg?imageView2/1/w/120/h/120",
        name: "LingLambda",
        url: "#LingLambda",
    },
    {
        img: "https://pic1.afdiancdn.com/default/avatar/avatar-blue.png?imageView2/1/w/120/h/120",
        name: "KaleElus",
        url: "#KaleElus",
    }
];
</script>

# 赞助者

ChatLuna 是一个开源项目，在开发过程中，我们也收到了很多用户的赞助和鼓励，非常感谢这些用户的支持，让 ChatLuna 能走的更远。

[爱发电](https://afdian.com/a/dingyi222666)

> 以下排名不分先后

<sponsors  :data="thinks" />
