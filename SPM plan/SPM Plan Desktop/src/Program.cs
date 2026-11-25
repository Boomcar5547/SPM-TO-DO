using System;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Threading.Tasks;
using System.Windows.Forms;
using Microsoft.Web.WebView2.Core;
using Microsoft.Web.WebView2.WinForms;

namespace SpmPlanDesktop
{
    internal static class Program
    {
        [STAThread]
        private static void Main()
        {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(new MainForm());
        }
    }

    internal sealed class MainForm : Form
    {
        private const string DefaultUrl = "https://boomcar5547.github.io/SPM-TO-DO/SPM%20plan/";

        private readonly WebView2 webView;
        private readonly Panel errorPanel;
        private readonly Label errorLabel;
        private readonly Button retryButton;
        private readonly Button browserButton;
        private string targetUrl;
        private bool initialized;

        public MainForm()
        {
            targetUrl = LoadUrl();

            Text = "SPM Plan";
            BackColor = Color.FromArgb(15, 23, 42);
            StartPosition = FormStartPosition.CenterScreen;
            var area = Screen.PrimaryScreen.WorkingArea;
            Width = Math.Min(1440, Math.Max(980, area.Width - 80));
            Height = Math.Min(900, Math.Max(620, area.Height - 80));
            MinimumSize = new Size(900, 600);
            try { Icon = Icon.ExtractAssociatedIcon(Application.ExecutablePath); } catch { }

            webView = new WebView2();
            webView.Dock = DockStyle.Fill;
            Controls.Add(webView);

            errorPanel = new Panel();
            errorPanel.Dock = DockStyle.Fill;
            errorPanel.BackColor = Color.FromArgb(15, 23, 42);
            errorPanel.Visible = false;
            Controls.Add(errorPanel);

            errorLabel = new Label();
            errorLabel.ForeColor = Color.FromArgb(233, 238, 248);
            errorLabel.BackColor = Color.Transparent;
            errorLabel.TextAlign = ContentAlignment.MiddleCenter;
            errorLabel.Font = new Font("Microsoft YaHei UI", 12.5F, FontStyle.Regular);
            errorPanel.Controls.Add(errorLabel);

            retryButton = new Button();
            retryButton.Text = "重试";
            retryButton.FlatStyle = FlatStyle.Flat;
            retryButton.FlatAppearance.BorderSize = 0;
            retryButton.BackColor = Color.FromArgb(16, 185, 129);
            retryButton.ForeColor = Color.White;
            retryButton.Font = new Font("Microsoft YaHei UI", 10F, FontStyle.Bold);
            retryButton.Cursor = Cursors.Hand;
            retryButton.Click += delegate { ReloadPage(); };
            errorPanel.Controls.Add(retryButton);

            browserButton = new Button();
            browserButton.Text = "用浏览器打开";
            browserButton.FlatStyle = FlatStyle.Flat;
            browserButton.FlatAppearance.BorderColor = Color.FromArgb(71, 85, 105);
            browserButton.BackColor = Color.FromArgb(30, 41, 59);
            browserButton.ForeColor = Color.FromArgb(226, 232, 240);
            browserButton.Font = new Font("Microsoft YaHei UI", 10F);
            browserButton.Cursor = Cursors.Hand;
            browserButton.Click += delegate
            {
                try { Process.Start(targetUrl); }
                catch { }
            };
            errorPanel.Controls.Add(browserButton);

            errorPanel.Resize += delegate { LayoutErrorPanel(); };
            Load += async delegate { await InitializeAsync(); };
            FormClosed += delegate
            {
                try { webView.Dispose(); }
                catch { }
            };
        }

        private async Task InitializeAsync()
        {
            try
            {
                var dataFolder = Path.Combine(
                    Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
                    "SPM Plan", "WebView2");
                Directory.CreateDirectory(dataFolder);

                var options = new CoreWebView2EnvironmentOptions();
                var debugPort = Environment.GetEnvironmentVariable("SPM_DEBUG_PORT");
                if (!string.IsNullOrEmpty(debugPort))
                {
                    options.AdditionalBrowserArguments = "--remote-debugging-port=" + debugPort;
                }

                var environment = await CoreWebView2Environment.CreateAsync(null, dataFolder, options);
                await webView.EnsureCoreWebView2Async(environment);

                var core = webView.CoreWebView2;
                core.Settings.IsStatusBarEnabled = false;
                core.Settings.AreDefaultContextMenusEnabled = true;
                core.DocumentTitleChanged += delegate
                {
                    try
                    {
                        Text = string.IsNullOrWhiteSpace(core.DocumentTitle) ? "SPM Plan" : core.DocumentTitle;
                    }
                    catch { }
                };
                core.NewWindowRequested += delegate(object sender, CoreWebView2NewWindowRequestedEventArgs e)
                {
                    e.Handled = true;
                    try { core.Navigate(e.Uri); }
                    catch { }
                };
                core.NavigationCompleted += OnNavigationCompleted;

                initialized = true;
                webView.Source = new Uri(targetUrl);
            }
            catch (Exception ex)
            {
                ShowError("无法启动内置浏览器组件。\n\n" + ex.Message + "\n\n请确认系统已安装 Microsoft Edge WebView2 运行库，或点击“用浏览器打开”。");
            }
        }

        private void OnNavigationCompleted(object sender, CoreWebView2NavigationCompletedEventArgs e)
        {
            if (!e.IsSuccess || (e.HttpStatusCode >= 400 && e.HttpStatusCode != 0))
            {
                string reason = "网络不可用或页面不存在";
                if (e.HttpStatusCode >= 400) reason = "HTTP " + e.HttpStatusCode;
                else if (!e.IsSuccess) reason = e.WebErrorStatus.ToString();
                ShowError("无法加载在线任务页面（" + reason + "）。\n\n请检查网络，或在 config.ini 里修正 url 后重新打开。");
                return;
            }

            errorPanel.Visible = false;
            webView.Visible = true;
        }

        private void ReloadPage()
        {
            errorPanel.Visible = false;
            webView.Visible = true;
            if (!initialized)
            {
                Load += async delegate { await InitializeAsync(); };
                return;
            }
            try { webView.Source = new Uri(targetUrl); }
            catch { }
        }

        private void ShowError(string message)
        {
            errorLabel.Text = message;
            errorPanel.Visible = true;
            errorPanel.BringToFront();
            LayoutErrorPanel();
        }

        private void LayoutErrorPanel()
        {
            int width = errorPanel.ClientSize.Width;
            int height = errorPanel.ClientSize.Height;
            if (width <= 0 || height <= 0) return;
            errorLabel.SetBounds(40, Math.Max(20, height / 2 - 160), Math.Max(100, width - 80), 180);
            int top = height / 2 + 40;
            retryButton.SetBounds(width / 2 - 160, top, 140, 40);
            browserButton.SetBounds(width / 2 + 20, top, 140, 40);
        }

        private static string LoadUrl()
        {
            try
            {
                var dir = Path.GetDirectoryName(Application.ExecutablePath);
                if (!string.IsNullOrEmpty(dir))
                {
                    var config = Path.Combine(dir, "config.ini");
                    if (File.Exists(config))
                    {
                        foreach (var rawLine in File.ReadAllLines(config))
                        {
                            var line = rawLine.Trim();
                            if (line.StartsWith("url=", StringComparison.OrdinalIgnoreCase))
                            {
                                var value = line.Substring(4).Trim();
                                if (value.Length > 0) return value;
                            }
                        }
                    }
                }
            }
            catch { }
            return DefaultUrl;
        }
    }
}

