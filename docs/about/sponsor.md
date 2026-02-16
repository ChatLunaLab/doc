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
        img: "https://q1.qlogo.cn/g?b=qq&nk=291260072&s=0",
        name: "咩咩",
        url: "#咩咩",
    },
    {
        img: "https://pic1.afdiancdn.com/user/979158d0e7d211ec95c152540025c377/avatar/d5573d81cfda4cc36f4cda19a264b02c_w640_h640_s16.jpeg?imageView2/1/w/120/h/120",
        name: "LingLambda",
        url: "#LingLambda",
    },
    {
        img: "https://pic1.afdiancdn.com/user/6d4a910c147211f0b46752540025c377/avatar/ed7e4e22ca3fb115b38b3821b67e1316_w1080_h561_s79.jpeg?imageView2/1/w/120/h/120",
        name: "不爱电用户_CQAX",
        url: "#不爱电用户_CQAX",
    },
   
    {
        img: "https://pic1.afdiancdn.com/user/8e969caa21fb11ed882552540025c377/avatar/521ff1ff9ce371778c3edcb2d374bc2f_w1440_h1440_s130.jpeg?imageView2/1/w/120/h/120",
        name: "Cook Sleep",
        url: "#Cook Sleep",
    },
    {
        name: "ffmpeg",
        url: "#ffmpeg",
        img: "https://pic1.afdiancdn.com/user/e09d2c8c082a11efaf7e5254001e7c00/avatar/708e1356e53a647823e760a5a9611658_w500_h500_s67.jpeg?imageView2/1/w/120/h/120",
    },
    {
        name: "爱发电用户_ba642",
        url: "#爱发电用户_ba642",
        img: "https://pic1.afdiancdn.com/default/avatar/avatar-purple.png?imageView2/1/"
    },
    {
       img: "https://q1.qlogo.cn/g?b=qq&nk=2019451078&s=0",
       name: "QJAG",
       url: "#QJAG",
   },
   {
      img: "https://q1.qlogo.cn/g?b=qq&nk=1627333583&s=0",
      name: "我的车在哪",
      url: "#我的车在哪",
  },
  {
     img: "https://q1.qlogo.cn/g?b=qq&nk=1761713639&s=0",
     name: "カナリア",
     url: "#カナリア",
 },
 {
    img: "https://q1.qlogo.cn/g?b=qq&nk=2657455842&s=0",
    name: "ch-03",
    url: "#ch-03",
},
{
   img: "https://q1.qlogo.cn/g?b=qq&nk=2284603810&s=0",
   name: "清",
   url: "#清",
},
    {
        img: "https://pic1.afdiancdn.com/user/6cec4d5aaf5611eda22e52540025c377/avatar/142700cc6b59c77aac5ee7490b0cc036_w1080_h1080_s43.jpeg?imageView2/1/w/120/h/120",
        name: "Mirage",
        url: "#Mirage"
    },
     {
        img: "https://pic1.afdiancdn.com/default/avatar/avatar-orange.png?imageView2/1/w/120/h/120",
        name: "来自夜航星",
        url: "#来自夜航星",
    },
    {
        img: "https://pic1.afdiancdn.com/user/6d4c567450d811eca3c852540025c377/avatar/fae1ec9c8ef86d6d2b34eec959cb23dc_w640_h640_s39.jpg?imageView2/1/w/120/h/120",
        name: "RikoNeko",
        url: "#RikoNeko",
    },
    {
        img: "https://pic1.afdiancdn.com/default/avatar/avatar-blue.png?imageView2/1/w/120/h/120",
        name: "Cloudwind.♨",
        url: "#Cloudwind.♨",
    },
    {
        img: "https://pic1.afdiancdn.com/user/c60f4b68d62e11ed9a6052540025c377/avatar/6051a2e73dfd3a6fb35d3ae5307614d4_w1254_h1771_s288.png?imageView2/1/w/120/h/120",
        name: "hoshino",
        url: "#hoshino",
    },
    {
        img: "https://pic1.afdiancdn.com/user/user_upload_osl/bbcee7deba46b2c757460d6d2c35f0c3_w132_h132_s4.jpeg?imageView2/1/w/120/h/120",
        name:"MashiroSaber",
        url: "#MashiroSaber"
    },
    {
        img: "https://pic1.afdiancdn.com/default/avatar/avatar-purple.png?imageView2/1/w/120/h/120",
        name:"爱发电用户_GPsK",
        url: "#爱发电用户_GPsK"
    },
    {
        img: "https://pic1.afdiancdn.com/default/avatar/avatar-purple.png?imageView2/1/w/120/h/120",
        name:"爱发电用户_2ad12",
        url: "#爱发电用户_2ad12"
    }
];
</script>

# 赞助者

ChatLuna 是一个开源项目，在开发过程中，我们也收到了很多用户的赞助和鼓励，非常感谢这些用户的支持，让 ChatLuna 能走的更远。

[爱发电](https://afdian.com/a/dingyi222666)

> 以下排名不分先后

<sponsors :data="thinks" />
