<script setup>
import { VPTeamMembers, VPTeamPageSection } from 'vitepress/theme'

const thinks = [
    {
        avatar: "https://avatar.viki.moe?qq=766949709",
        name: "EF台风",
    },
    {
        avatar: "https://avatar.viki.moe?qq=2371124484",
        name: "TR0MX",
    },
    {
        avatar: "https://avatar.viki.moe?qq=52473342",
        name: "僵尸尸",
    },
    {
        avatar: "https://avatar.viki.moe?qq=3373167460",
        name: "Nawyjx",
    },
    {
        avatar: "https://avatar.viki.moe?qq=3283406743",
        name: "Ling",
    },
    {
        avatar: "https://avatar.viki.moe?qq=1919892171",
        name: "上学",
    },
    {
        avatar: "https://avatar.viki.moe?qq=503753255",
        name: "飞@^O^",
    },
    {
        avatar: "https://avatar.viki.moe?qq=3374687501",
        name: "WhiteGivenMan",
    },
    {
        avatar: "https://pic1.afdiancdn.com/default/avatar/avatar-blue.png?imageView2/1/w/120/h/120",
        name: "KaleElus",
    }
];
</script>

# 赞助者

ChatLuna 是一个开源项目，在开发过程中，我们也收到了很多用户的赞助和鼓励，非常感谢这些用户的支持，让 ChatLuna 能走的更远。

[爱发电](https://afdian.com/a/dingyi222666)

<VPTeamPage>
    <VPTeamPageSection>
        <template #title>Sponsors</template>
        <template #lead>排名不分先后</template>
        <template #members>
            <VPTeamMembers size="small" :members="thinks" />
        </template>
    </VPTeamPageSection>
</VPTeamPage>
