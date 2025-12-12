# movecar挪车页面

<img width="515" height="542" alt="image" src="https://github.com/user-attachments/assets/eebc0293-b498-4f15-8994-ef9397e42b0b" />

这是一个基于 Cloudflare Workers 搭建的自适应挪车页面。

可实现微信消息推送和一键拨打电话

微信消息推送使用<a href="https://github.com/qmzz/cf_wxpush" target="_blank">wxpush</a>自行搭建

需要配置的环境变量：

PUSH_API_URL，推送服务API地址

API_TOKEN，推送服务Token

PHONE_NUMBER，车主电话号码

CAR_PLATE，车牌号


挪车页面具备以下特性：

安全性高：API地址、Token、手机号、车牌全部隐藏在环境变量中。

兼容性好：后端使用 POST 方式，并在 Header 和 Body 中同时携带 Token，兼容性最强。

体验优秀：界面有新能源车牌样式，按钮有防抖动倒计时，错误信息会友好提示。
