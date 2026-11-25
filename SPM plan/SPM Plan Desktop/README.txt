SPM Plan 桌面版（Windows 10 / 11 x64）
=====================================

启动
----
双击同目录下的 "SPM Plan.exe"。

本程序是一个内置浏览器窗口，启动后加载你的 GitHub Pages：
https://boomcar5547.github.io/SPM-TO-DO/SPM%20plan/

任务数据仍然来自仓库里的 tasks.json。更新任务的流程：
1. 在页面里改任务。
2. 点左下角“发布数据”，下载 tasks.json。
3. 到 GitHub 仓库上传替换同名文件。
4. 重新打开或刷新程序。

注意
----
- 需要联网。
- 需要 Microsoft Edge WebView2 运行库；Windows 10/11 通常自带。
- 请保持 exe 与旁边的 DLL 文件在同一目录，不要只单独移动 exe。
- 第一次运行出现 Windows SmartScreen 时，选择“更多信息 → 仍要运行”。
- 本地缓存和登录数据在：%LOCALAPPDATA%\SPM Plan\WebView2
- 修改 config.ini 里的 url= 可以更换打开的页面地址。

关于地址
--------
当前仓库里的文件放在 "SPM plan" 子目录，所以 Pages 地址包含 %20，直接访问仓库根地址会 404。
如果以后把网页文件移动到仓库根目录，可以把 config.ini 改成：
url=https://boomcar5547.github.io/SPM-TO-DO/
