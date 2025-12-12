addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url);

  // --- 1. 获取环境变量 ---
  // 请确保后台 Variables 已配置: PHONE_NUMBER, API_TOKEN, CAR_PLATE, PUSH_API_URL
  const apiUrl = PUSH_API_URL;
  const token = API_TOKEN;
  const phone = PHONE_NUMBER;
  const plate = CAR_PLATE;
  
  
  const pushTitle = '挪车通知';
  const pushContent = '您好，有人需要您挪车，请及时处理';

  // --- 2. 后端逻辑 ---
  if (url.searchParams.get('action') === 'notify') {
    
	// 构造 POST 请求参数
    const postOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token // 按照您的 curl 示例，将 token 放在 Header 中
      },
      body: JSON.stringify({
        title: pushTitle,
        content: pushContent
      })
    };
    
    try {
      // 发起 POST 请求
	  const resp = await fetch(targetUrl);
      
	  if (resp.status === 200) {
        return new Response('OK', { status: 200 });
      } else {
        return new Response('Fail', { status: 500 });
      }
    } catch (e) {
      return new Response('Error', { status: 500 });
    }
  }

  // --- 3. 前端界面 ---
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="zh-CN">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>通知车主挪车</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #f0f2f5; color: #333; }
          .container { text-align: center; padding: 30px 20px; width: 90%; max-width: 400px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); background: #fff; }
          
          /* 车牌样式：新能源绿渐变 */
          .plate-box {
            display: inline-block;
            /* 从上到下的渐变：白色 -> 亮绿色 */
            background: linear-gradient(180deg, #ffffff 10%, #52c41a 100%);
            color: #111; /* 新能源车牌字通常是黑色 */
            font-weight: bold;
            font-size: 20px;
            padding: 6px 12px;
            border-radius: 6px;
            border: 1px solid #b7eb8f; /* 浅绿边框 */
            box-shadow: 0 2px 5px rgba(0, 100, 0, 0.15);
            margin-bottom: 20px;
            margin-top: 5px;
            letter-spacing: 2px;
            text-shadow: 0 1px 0 rgba(255,255,255,0.5); /* 增加一点文字立体感 */
          }

          h1 { font-size: 24px; margin-bottom: 10px; color: #1f2937; }
          p { margin-bottom: 30px; font-size: 16px; color: #6b7280; }
          
          button { width: 100%; padding: 14px; margin: 8px 0; font-size: 16px; font-weight: 600; color: #fff; border: none; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
          button:active { opacity: 0.8; }
          .notify-btn { background: #10b981; }
          .notify-btn:disabled { background: #9ca3af; cursor: not-allowed; }
          .call-btn { background: #3b82f6; }
        </style>
      </head>
      <body>
        <div class="container">
          <div style="font-size: 48px; margin-bottom: 5px;">🚗</div>
          
          <div class="plate-box">${plate}</div>

          <h1>临时停靠 请多关照</h1>
          <p>您好，如果阻挡了您的出行<br>请点击下方按钮通知我</p>
          
          <button id="notifyBtn" class="notify-btn" onclick="notifyOwner()">💬 微信通知车主</button>
          <button class="call-btn" onclick="callOwner()">📞 拨打车主电话</button>
        </div>

        <script>
          function notifyOwner() {
            const btn = document.getElementById('notifyBtn');
            const originalText = btn.innerText;
            btn.disabled = true;
            btn.innerText = '正在发送通知...';

            fetch(window.location.pathname + '?action=notify')
              .then(res => {
                if (res.ok) {
                   alert("✅ 通知已发送，车主会尽快赶来！");
                } else {
                   alert("❌ 发送失败，请直接拨打下方电话。");
                }
              })
              .catch(() => {
                alert("❌ 网络错误，请直接拨打电话。");
              })
              .finally(() => {
                let countdown = 60;
                const timer = setInterval(() => {
                    btn.innerText = "已发送 (" + countdown + "s)";
                    countdown--;
                    if (countdown < 0) {
                        clearInterval(timer);
                        btn.disabled = false;
                        btn.innerText = originalText;
                    }
                }, 1000);
              });
          }

          function callOwner() {
            window.location.href = "tel:${phone}";
          }
        </script>
      </body>
    </html>
  `

  return new Response(htmlContent, {
    headers: { 'Content-Type': 'text/html;charset=UTF-8' },
  })
}
