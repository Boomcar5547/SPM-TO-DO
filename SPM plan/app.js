/* =========================================================
   SPM Plan · app.js
   纯前端任务进度管理 / 数据保存在 localStorage
   ========================================================= */

(function () {
  'use strict';

  var STORAGE_KEY = 'spm-plan-data-v1';
  var DATA_FILE = 'tasks.json';
  var LIST_COLORS = ['#38bdf8', '#a78bfa', '#34d399', '#fb7185', '#fbbf24', '#22d3ee', '#f472b6', '#84cc16'];

  var ICONS = {
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.8v2.4M12 18.8v2.4M4.6 4.6l1.7 1.7M17.7 17.7l1.7 1.7M2.8 12h2.4M18.8 12h2.4M4.6 19.4l1.7-1.7M17.7 6.3l1.7-1.7"/>',
    star: '<path d="M12 3.4l2.6 5.4 5.9.9-4.3 4.2 1 5.9-5.2-2.8-5.2 2.8 1-5.9L3.5 9.7l5.9-.9z"/>',
    calendar: '<rect x="3.4" y="5.2" width="17.2" height="15.6" rx="3"/><path d="M8 3v4M16 3v4M3.4 10.2h17.2"/>',
    inbox: '<path d="M4.2 5.4h15.6l1.4 8.2v4.2a2.2 2.2 0 0 1-2.2 2.2H4.8a2.2 2.2 0 0 1-2.2-2.2v-4.2z"/><path d="M2.6 13.6h4.8l1.5 2.6h6.2l1.5-2.6h4.8"/>',
    check: '<path d="M4.5 12.6l4.7 4.7L19.6 5.9"/>',
    search: '<circle cx="10.8" cy="10.8" r="6.6"/><path d="M15.7 15.7L21 21"/>',
    plus: '<path d="M12 5.2v13.6M5.2 12h13.6"/>',
    trash: '<path d="M4 7h16M9.6 7V4.4h4.8V7M6.6 7l1 13.2h8.8l1-13.2"/>',
    close: '<path d="M6.2 6.2l11.6 11.6M17.8 6.2L6.2 17.8"/>',
    image: '<rect x="3" y="4.6" width="18" height="14.8" rx="3"/><circle cx="8.4" cy="9.8" r="1.5"/><path d="M4.2 16.8l4.8-4.2 3.8 3.2 2.9-2.4 4 3.4"/>',
    moon: '<path d="M19.8 14.2A8.2 8.2 0 0 1 9.8 4.2a8.2 8.2 0 1 0 10 10z"/>',
    download: '<path d="M12 3.4v11.8M7.4 10.8L12 15.4l4.6-4.6M4.4 20h15.2"/>',
    upload: '<path d="M12 15.4V3.6M7.4 8.2L12 3.6l4.6 4.6M4.4 20h15.2"/>',
    note: '<path d="M6 3.4h8.2L19 8.2v12.4H6z"/><path d="M14.2 3.4v4.8H19M9 12.6h6.4M9 16.2h4.4"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    palette: '<path d="M12 3.2a8.8 8.8 0 1 0 0 17.6c1.2 0 1.9-.8 1.9-1.8 0-1.6-1.4-1.7-1.4-3.2 0-1.2 1-1.8 2.3-1.8h2.1c2.3 0 4-1.7 4-4 0-3.7-4-6.8-8.9-6.8z"/><circle cx="7.6" cy="10" r="1.1" fill="currentColor" stroke="none"/><circle cx="11" cy="7.2" r="1.1" fill="currentColor" stroke="none"/><circle cx="15" cy="8.2" r="1.1" fill="currentColor" stroke="none"/>',
    list: '<path d="M8.4 6.6h11.2M8.4 12h11.2M8.4 17.4h11.2"/><circle cx="4.4" cy="6.6" r="1.2" fill="currentColor" stroke="none"/><circle cx="4.4" cy="12" r="1.2" fill="currentColor" stroke="none"/><circle cx="4.4" cy="17.4" r="1.2" fill="currentColor" stroke="none"/>',
    step: '<path d="M9.4 6.5h10.8M9.4 12h10.8M9.4 17.5h10.8"/><path d="M3.6 6.4l1.3 1.3 2.2-2.4M3.6 12l1.3 1.3 2.2-2.4M3.6 17.5l1.3 1.3 2.2-2.4"/>',
    sparkles: '<path d="M12 3.2l1.7 4.3 4.3 1.7-4.3 1.7L12 15.2l-1.7-4.3L6 9.2l4.3-1.7z"/><path d="M18.4 15.2l.9 2.2 2.2.9-2.2.9-.9 2.2-.9-2.2-2.2-.9 2.2-.9z"/>',
    link: '<path d="M10.6 13.4a4 4 0 0 0 5.7 0l2.8-2.8a4 4 0 0 0-5.7-5.7l-1.6 1.6"/><path d="M13.4 10.6a4 4 0 0 0-5.7 0l-2.8 2.8a4 4 0 0 0 5.7 5.7l1.6-1.6"/>',
    refresh: '<path d="M20 12a8 8 0 1 1-2.3-5.6M20 4v5h-5"/>',
    cloud: '<path d="M7.3 18.4a4.4 4.4 0 0 1-.3-8.8 6 6 0 0 1 11.6 1.4 3.7 3.7 0 0 1-.6 7.4z"/><path d="M12 13.2v5M9.8 15.4L12 13.2l2.2 2.2"/>',
    chevronDown: '<path d="M6 9.5l6 6 6-6"/>'
  };

  var PRESETS = {
    aurora: {
      name: '极光',
      css: 'radial-gradient(at 12% 18%, rgba(56,189,248,.85) 0px, transparent 42%), radial-gradient(at 78% 8%, rgba(167,139,250,.75) 0px, transparent 40%), radial-gradient(at 72% 82%, rgba(52,211,153,.55) 0px, transparent 46%), linear-gradient(150deg, #070d1b 0%, #101c33 48%, #16233f 100%)'
    },
    sunrise: {
      name: '晨曦',
      css: 'radial-gradient(at 15% 20%, #fecaca 0px, transparent 45%), radial-gradient(at 85% 15%, #fde68a 0px, transparent 50%), radial-gradient(at 60% 85%, #fbcfe8 0px, transparent 55%), linear-gradient(160deg, #fff1f2, #ffe4e6 45%, #fef3c7)'
    },
    mint: {
      name: '薄荷',
      css: 'radial-gradient(at 20% 15%, #a7f3d0 0px, transparent 45%), radial-gradient(at 80% 30%, #bae6fd 0px, transparent 50%), radial-gradient(at 50% 90%, #d9f99d 0px, transparent 55%), linear-gradient(150deg, #ecfdf5, #f0fdfa 50%, #eff6ff)'
    },
    sakura: {
      name: '樱花',
      css: 'radial-gradient(at 25% 20%, #fbcfe8 0px, transparent 45%), radial-gradient(at 80% 10%, #ddd6fe 0px, transparent 50%), radial-gradient(at 65% 85%, #fed7aa 0px, transparent 55%), linear-gradient(160deg, #fdf2f8, #f5f3ff)'
    },
    midnight: {
      name: '深夜',
      css: 'radial-gradient(at 20% 85%, rgba(59,130,246,.55) 0px, transparent 45%), radial-gradient(at 80% 20%, rgba(99,102,241,.5) 0px, transparent 45%), linear-gradient(150deg, #01040d, #0b1220 55%, #1e1b4b)'
    },
    dune: {
      name: '流沙',
      css: 'radial-gradient(at 15% 20%, #fde68a 0px, transparent 45%), radial-gradient(at 80% 15%, #fdba74 0px, transparent 50%), radial-gradient(at 55% 85%, #f5d0fe 0px, transparent 55%), linear-gradient(160deg, #fffbeb, #fef3c7 40%, #fde2c8)'
    }
  };

  var ACCENTS = {
    emerald: { name: '翡翠', color: '#10b981', soft: 'rgba(16,185,129,.15)', grad: 'linear-gradient(135deg,#34d399,#0ea5e9)' },
    violet: { name: '紫罗兰', color: '#8b5cf6', soft: 'rgba(139,92,246,.16)', grad: 'linear-gradient(135deg,#a78bfa,#6366f1)' },
    azure: { name: '海蓝', color: '#0ea5e9', soft: 'rgba(14,165,233,.16)', grad: 'linear-gradient(135deg,#38bdf8,#6366f1)' },
    rose: { name: '玫瑰', color: '#f43f5e', soft: 'rgba(244,63,94,.14)', grad: 'linear-gradient(135deg,#fb7185,#f59e0b)' },
    amber: { name: '琥珀', color: '#d97706', soft: 'rgba(245,158,11,.17)', grad: 'linear-gradient(135deg,#fbbf24,#f97316)' }
  };

  var VIEW_META = {
    myday: { title: '我的一天', subtitle: '挑出今天最想完成的事，专注推进。' },
    important: { title: '重要', subtitle: '先做重要的事，别被琐事推着走。' },
    planned: { title: '计划', subtitle: '按日期浏览任务，提前安排节奏。' },
    all: { title: '全部任务', subtitle: '所有清单的任务都在这里。' },
    completed: { title: '已完成', subtitle: '回顾完成的每一件事。' }
  };

  var ui = {
    view: { type: 'myday', id: null },
    query: '',
    editingId: null,
    newImportant: false,
    animateNext: false,
    expandedSteps: {}
  };

  var state = null;
  var saveTimer = null;
  var toastTimer = null;
  var lastContentSignature = '';
  var pendingRemote = null;
  var syncInFlight = false;

  /* ---------------- 工具函数 ---------------- */

  function $(selector, root) {
    return (root || document).querySelector(selector);
  }

  function $$(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function icon(name) {
    return '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[name] || '') + '</svg>';
  }

  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function uid() {
    return 'x' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  function pad2(n) {
    return String(n).padStart(2, '0');
  }

  function dateKey(date) {
    return date.getFullYear() + '-' + pad2(date.getMonth() + 1) + '-' + pad2(date.getDate());
  }

  function parseKey(key) {
    var parts = String(key || '').split('-');
    if (parts.length !== 3) return null;
    var year = Number(parts[0]);
    var month = Number(parts[1]);
    var day = Number(parts[2]);
    if (!year || !month || !day) return null;
    return new Date(year, month - 1, day);
  }

  function todayKey() {
    return dateKey(new Date());
  }

  function shiftKey(days) {
    var d = new Date();
    d.setDate(d.getDate() + days);
    return dateKey(d);
  }

  function isDateKey(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    var d = parseKey(value);
    return !!d && dateKey(d) === value;
  }

  function diffDays(key) {
    var due = parseKey(key);
    if (!due) return 9999;
    var today = parseKey(todayKey());
    return Math.round((due.getTime() - today.getTime()) / 86400000);
  }

  function dueMeta(key) {
    var date = parseKey(key);
    if (!date) return { label: '日期未知', cls: '' };
    var diff = Math.round((date.getTime() - parseKey(todayKey()).getTime()) / 86400000);
    if (diff < 0) return { label: '已逾期 ' + Math.abs(diff) + ' 天', cls: 'overdue' };
    if (diff === 0) return { label: '今天', cls: 'today' };
    if (diff === 1) return { label: '明天', cls: '' };
    if (diff === 2) return { label: '后天', cls: '' };
    if (diff <= 6) return { label: '周' + '日一二三四五六'.charAt(date.getDay()), cls: '' };
    var label = (date.getMonth() + 1) + '月' + date.getDate() + '日';
    if (date.getFullYear() !== new Date().getFullYear()) label = date.getFullYear() + '年' + label;
    return { label: label, cls: '' };
  }

  function truncate(text, limit) {
    var value = String(text || '');
    return value.length > limit ? value.slice(0, limit) + '…' : value;
  }

  function dateLabel() {
    var d = new Date();
    var week = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][d.getDay()];
    return (d.getMonth() + 1) + '月' + d.getDate() + '日 · ' + week;
  }

  function greetingText() {
    var hour = new Date().getHours();
    if (hour < 5) return '夜深了';
    if (hour < 11) return '早上好';
    if (hour < 14) return '中午好';
    if (hour < 18) return '下午好';
    return '晚上好';
  }

  function formatStamp(ts) {
    var d = new Date(ts);
    if (isNaN(d.getTime())) return '';
    return (d.getMonth() + 1) + '月' + d.getDate() + '日 ' + pad2(d.getHours()) + ':' + pad2(d.getMinutes());
  }

  function findTask(id) {
    for (var i = 0; i < state.tasks.length; i++) {
      if (state.tasks[i].id === id) return state.tasks[i];
    }
    return null;
  }

  function findList(id) {
    for (var i = 0; i < state.lists.length; i++) {
      if (state.lists[i].id === id) return state.lists[i];
    }
    return null;
  }

  /* ---------------- 数据 ---------------- */

  function defaultSettings() {
    return {
      theme: 'auto',
      accent: 'emerald',
      surface: 62,
      glassBlur: 14,
      wallpaper: { preset: 'aurora', image: '', blur: 0, dim: 22 },
      showCompleted: false
    };
  }

  function normalize(data) {
    if (!data || typeof data !== 'object' || !Array.isArray(data.tasks) || !Array.isArray(data.lists)) return null;

    var lists = [];
    var seenLists = {};
    data.lists.forEach(function (item, index) {
      if (!item || typeof item !== 'object') return;
      var id = String(item.id || ('list-' + index));
      if (seenLists[id]) return;
      seenLists[id] = true;
      lists.push({
        id: id,
        name: String(item.name || '未命名清单').slice(0, 30),
        color: /^#[0-9a-fA-F]{3,8}$/.test(String(item.color || '')) ? item.color : LIST_COLORS[lists.length % LIST_COLORS.length]
      });
    });
    if (!lists.length) lists.push({ id: 'inbox', name: '日常', color: LIST_COLORS[0] });

    var listIds = {};
    lists.forEach(function (list) { listIds[list.id] = true; });

    var tasks = [];
    data.tasks.forEach(function (item, index) {
      if (!item || typeof item !== 'object') return;
      var title = String(item.title == null ? '' : item.title).trim();
      if (!title) title = '未命名任务';
      var steps = [];
      if (Array.isArray(item.steps)) {
        item.steps.forEach(function (step, stepIndex) {
          if (!step || !step.text) return;
          steps.push({
            id: String(step.id || ('step-' + index + '-' + stepIndex)),
            text: String(step.text).slice(0, 120),
            done: !!step.done
          });
        });
      }
      tasks.push({
        id: String(item.id || ('task-' + index)),
        title: title.slice(0, 160),
        listId: listIds[String(item.listId)] ? String(item.listId) : lists[0].id,
        done: !!item.done,
        important: !!item.important,
        myDay: !!item.myDay,
        due: isDateKey(item.due) ? item.due : '',
        note: typeof item.note === 'string' ? item.note.slice(0, 2000) : '',
        steps: steps.slice(0, 100),
        createdAt: Number(item.createdAt) || (Date.now() - index * 1000),
        completedAt: item.completedAt ? Number(item.completedAt) : (item.done ? Date.now() - index * 1000 : null)
      });
    });

    var base = defaultSettings();
    var incoming = (data.settings && typeof data.settings === 'object') ? data.settings : {};
    var settings = {
      theme: (incoming.theme === 'light' || incoming.theme === 'dark' || incoming.theme === 'auto') ? incoming.theme : base.theme,
      accent: ACCENTS[incoming.accent] ? incoming.accent : base.accent,
      showCompleted: !!incoming.showCompleted,
      surface: isFinite(Number(incoming.surface)) ? Math.max(20, Math.min(90, Number(incoming.surface))) : base.surface,
      glassBlur: isFinite(Number(incoming.glassBlur)) ? Math.max(0, Math.min(24, Number(incoming.glassBlur))) : base.glassBlur,
      wallpaper: { preset: base.wallpaper.preset, image: '', blur: 0, dim: 22 }
    };

    var wp = (incoming.wallpaper && typeof incoming.wallpaper === 'object') ? incoming.wallpaper : {};
    settings.wallpaper.image = typeof wp.image === 'string' ? wp.image : '';
    settings.wallpaper.preset = PRESETS[wp.preset] ? wp.preset : null;
    settings.wallpaper.blur = Math.max(0, Math.min(24, Number(wp.blur) || 0));
    settings.wallpaper.dim = Math.max(0, Math.min(80, isFinite(Number(wp.dim)) ? Number(wp.dim) : 22));
    if (!settings.wallpaper.preset && !settings.wallpaper.image) settings.wallpaper.preset = 'aurora';

    var updatedAt = Number(data.updatedAt);
    if (!isFinite(updatedAt) || updatedAt <= 0) {
      var exportedAt = Date.parse(String(data.exportedAt || ''));
      updatedAt = isFinite(exportedAt) ? exportedAt : 0;
    }

    return { version: 1, updatedAt: updatedAt, tasks: tasks, lists: lists, settings: settings };
  }

  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return normalize(JSON.parse(raw));
    } catch (err) {
      return null;
    }
  }

  function save() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(persistNow, 180);
  }

  function persistNow() {
    clearTimeout(saveTimer);
    saveTimer = null;
    if (!state) return;

    var signature = contentSignature();
    if (lastContentSignature && signature !== lastContentSignature) {
      state.updatedAt = Date.now();
    }
    lastContentSignature = signature;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      showToast('本地保存失败：存储空间不足，请换一张更小的壁纸');
    }
  }

  function contentSignature() {
    return JSON.stringify({ tasks: state.tasks, lists: state.lists });
  }

  function stateSignature(target) {
    return JSON.stringify({ tasks: target.tasks, lists: target.lists });
  }

  function seedState() {
    var now = Date.now();
    function mk(overrides) {
      return Object.assign({
        id: uid(),
        title: '',
        listId: 'inbox',
        done: false,
        important: false,
        myDay: false,
        due: '',
        note: '',
        steps: [],
        createdAt: now,
        completedAt: null
      }, overrides || {});
    }

    var data = {
      version: 1,
      updatedAt: 0,
      lists: [
        { id: 'inbox', name: '日常', color: '#38bdf8' },
        { id: 'work', name: '工作', color: '#a78bfa' },
        { id: 'study', name: '学习', color: '#34d399' },
        { id: 'life', name: '生活', color: '#fb7185' }
      ],
      tasks: [
        mk({
          title: '整理本周工作计划', listId: 'work', important: true, myDay: true,
          due: todayKey(), note: '把本周最影响结果的三件事写清楚，其余可以往后排。',
          steps: [
            { id: uid(), text: '列出本周的三个目标', done: true },
            { id: uid(), text: '拆解成每天能完成的小任务', done: false },
            { id: uid(), text: '给突发情况留出缓冲时间', done: false }
          ],
          createdAt: now - 1000 * 60 * 30
        }),
        mk({
          title: '完成首页视觉稿评审', listId: 'work', important: true,
          due: shiftKey(1), note: '重点看信息层级和按钮状态。',
          steps: [
            { id: uid(), text: '整理反馈清单', done: false },
            { id: uid(), text: '同步给设计同学', done: false }
          ],
          createdAt: now - 1000 * 60 * 55
        }),
        mk({
          title: '阅读《深度工作》第 3 章', listId: 'study', myDay: true,
          due: shiftKey(2), createdAt: now - 1000 * 60 * 80
        }),
        mk({
          title: '跑步 30 分钟', listId: 'life', myDay: true, due: todayKey(),
          steps: [
            { id: uid(), text: '热身 5 分钟', done: true },
            { id: uid(), text: '慢跑 30 分钟', done: false }
          ],
          createdAt: now - 1000 * 60 * 120
        }),
        mk({
          title: '更新项目 README', listId: 'work', important: true,
          due: shiftKey(-1), note: '补充安装步骤和截图。',
          createdAt: now - 1000 * 60 * 60 * 5
        }),
        mk({
          title: '回复客户邮件', listId: 'work', due: shiftKey(4),
          createdAt: now - 1000 * 60 * 60 * 8
        }),
        mk({
          title: '预约周末体检', listId: 'life', due: shiftKey(6),
          createdAt: now - 1000 * 60 * 60 * 9
        }),
        mk({
          title: '背 20 个单词', listId: 'study', myDay: true, done: true,
          due: todayKey(), completedAt: now - 1000 * 60 * 90,
          createdAt: now - 1000 * 60 * 60 * 11
        }),
        mk({
          title: '整理上月照片备份', listId: 'life', done: true,
          completedAt: now - 1000 * 60 * 60 * 26,
          createdAt: now - 1000 * 60 * 60 * 30
        }),
        mk({
          title: '给家里打个电话', listId: 'life', myDay: true,
          createdAt: now - 1000 * 60 * 60 * 2
        })
      ],
      settings: defaultSettings()
    };

    return normalize(data);
  }

  /* ---------------- 仓库同步 ---------------- */

  function canFetchRepo() {
    return typeof window.fetch === 'function' && window.location.protocol !== 'file:';
  }

  function fetchRepoData() {
    if (!canFetchRepo()) return Promise.resolve(null);

    var controller = null;
    var timer = null;
    var options = { cache: 'no-store' };
    if (typeof window.AbortController === 'function') {
      controller = new window.AbortController();
      options.signal = controller.signal;
      timer = setTimeout(function () { controller.abort(); }, 5000);
    }

    return window.fetch(DATA_FILE + '?v=' + Date.now(), options)
      .then(function (response) {
        if (!response.ok) return null;
        return response.json();
      })
      .then(function (data) {
        if (timer) clearTimeout(timer);
        return normalize(data);
      })
      .catch(function () {
        if (timer) clearTimeout(timer);
        return null;
      });
  }

  function showSyncBanner(remote) {
    pendingRemote = remote;
    var banner = $('#syncBanner');
    if (!banner) return;
    var label = '仓库有较新的任务数据';
    if (remote.updatedAt) label += ' · ' + formatStamp(remote.updatedAt);
    $('#syncBannerText').textContent = label;
    banner.hidden = false;
  }

  function hideSyncBanner() {
    pendingRemote = null;
    var banner = $('#syncBanner');
    if (banner) banner.hidden = true;
  }

  function applyRemoteState(remote, full) {
    var previous = state;
    var localSettings = state.settings;

    state = {
      version: 1,
      updatedAt: remote.updatedAt || 0,
      tasks: remote.tasks,
      lists: remote.lists,
      settings: full ? remote.settings : localSettings
    };
    lastContentSignature = contentSignature();

    if (ui.editingId) closeDrawer();
    ui.expandedSteps = {};
    if (ui.view.type === 'list' && !findList(ui.view.id)) {
      ui.view = { type: 'all', id: null };
    }
    if (full) {
      applyTheme();
      applySurface();
      applyWallpaper();
    }

    persistNow();
    ui.animateNext = true;
    render();
    if ($('#sheet').classList.contains('open')) renderSettings();
    hideSyncBanner();

    if (full) {
      showToast('已从仓库载入任务数据');
      return;
    }

    showToast('已载入仓库中的最新任务', function () {
      state = previous;
      lastContentSignature = contentSignature();
      persistNow();
      ui.animateNext = true;
      render();
      if ($('#sheet').classList.contains('open')) renderSettings();
      showToast('已恢复同步前的数据');
    });
  }

  function syncRepo(manual, firstRun) {
    if (!canFetchRepo()) {
      if (manual) showToast('本地文件模式无法读取仓库，请通过 GitHub Pages 打开');
      return;
    }
    if (syncInFlight) return;
    syncInFlight = true;

    fetchRepoData().then(function (remote) {
      syncInFlight = false;
      if (!remote) {
        if (manual) showToast('没有读取到 tasks.json，请确认已上传到仓库根目录');
        return;
      }

      if (firstRun) {
        applyRemoteState(remote, true);
        return;
      }

      if (stateSignature(remote) === contentSignature()) {
        hideSyncBanner();
        if (manual) showToast('仓库数据已是最新');
        return;
      }

      if (manual) {
        applyRemoteState(remote, false);
        return;
      }

      if (remote.updatedAt > state.updatedAt) {
        showSyncBanner(remote);
      }
    });
  }

  /* ---------------- 视图数据 ---------------- */

  function getViewTasks() {
    var v = ui.view;
    if (v.type === 'myday') return state.tasks.filter(function (t) { return t.myDay; });
    if (v.type === 'important') return state.tasks.filter(function (t) { return t.important; });
    if (v.type === 'planned') return state.tasks.filter(function (t) { return !!t.due; });
    if (v.type === 'completed') return state.tasks.filter(function (t) { return t.done; });
    if (v.type === 'list') return state.tasks.filter(function (t) { return t.listId === v.id; });
    return state.tasks.slice();
  }

  function getVisibleTasks() {
    var q = ui.query.trim().toLowerCase();
    if (!q) return getViewTasks();
    return state.tasks.filter(function (t) {
      var haystack = (t.title + ' ' + t.note + ' ' + t.steps.map(function (s) { return s.text; }).join(' ')).toLowerCase();
      return haystack.indexOf(q) >= 0;
    });
  }

  function sortTasks(tasks) {
    return tasks.slice().sort(function (a, b) {
      if (a.done !== b.done) return a.done ? 1 : -1;
      if (a.done && b.done) return (b.completedAt || 0) - (a.completedAt || 0);
      if (!!a.important !== !!b.important) return a.important ? -1 : 1;
      var ad = a.due ? diffDays(a.due) : 99999;
      var bd = b.due ? diffDays(b.due) : 99999;
      if (ad !== bd) return ad - bd;
      return (b.createdAt || 0) - (a.createdAt || 0);
    });
  }

  /* ---------------- 渲染 ---------------- */

  function render() {
    renderLists();
    renderNav();
    renderHeader();
    renderHero();
    renderComposerOptions();
    renderListBar();
    renderTasks();
    if (ui.editingId && !findTask(ui.editingId)) closeDrawer();
  }

  function renderNav() {
    var counts = {
      myday: 0,
      important: 0,
      planned: 0,
      all: 0
    };
    state.tasks.forEach(function (t) {
      if (t.done) return;
      counts.all += 1;
      if (t.myDay) counts.myday += 1;
      if (t.important) counts.important += 1;
      if (t.due) counts.planned += 1;
    });

    $$('#smartNav .nav-item').forEach(function (el) {
      el.classList.toggle('active', !ui.query.trim() && ui.view.type === el.getAttribute('data-view'));
    });
    $$('#smartNav [data-count]').forEach(function (el) {
      var n = counts[el.getAttribute('data-count')] || 0;
      el.textContent = n ? String(n) : '';
    });
  }

  function renderLists() {
    var nav = $('#listNav');
    if (!nav) return;
    nav.innerHTML = state.lists.map(function (list) {
      var count = state.tasks.filter(function (t) { return !t.done && t.listId === list.id; }).length;
      var active = ui.view.type === 'list' && ui.view.id === list.id;
      return '<div class="list-item-wrap">' +
        '<button type="button" class="list-item' + (active ? ' active' : '') + '" data-list="' + esc(list.id) + '" title="' + esc(list.name) + '">' +
          '<span class="dot" style="background:' + list.color + '"></span>' +
          '<span class="nav-label">' + esc(list.name) + '</span>' +
          (count ? '<span class="badge">' + count + '</span>' : '') +
        '</button>' +
        '<button type="button" class="nav-del" data-action="delete-list" data-list-id="' + esc(list.id) + '" aria-label="删除清单" title="删除清单">' + icon('close') + '</button>' +
      '</div>';
    }).join('');
  }

  function renderHeader() {
    var title;
    var subtitle;
    var q = ui.query.trim();
    if (q) {
      title = '搜索';
      subtitle = '关于 “' + q + '” 的搜索结果';
    } else if (ui.view.type === 'list') {
      var list = findList(ui.view.id);
      title = list ? list.name : '清单';
      subtitle = '清单里的任务会一直保留，直到你完成它。';
    } else {
      var meta = VIEW_META[ui.view.type] || VIEW_META.myday;
      title = meta.title;
      subtitle = meta.subtitle;
    }
    $('#viewTitle').textContent = title;
    $('#viewSubtitle').textContent = subtitle;
    $('#dateChip').textContent = dateLabel();
  }

  function renderHero() {
    var scoped = ui.query.trim() ? getVisibleTasks() : getViewTasks();
    var total = scoped.length;
    var done = scoped.filter(function (t) { return t.done; }).length;
    var pending = total - done;
    var overdue = scoped.filter(function (t) { return !t.done && t.due && diffDays(t.due) < 0; }).length;
    var percent = total ? Math.round((done / total) * 100) : 0;
    var circumference = 2 * Math.PI * 50;

    var ring = $('#ringValue');
    if (ring) {
      ring.style.strokeDasharray = String(circumference);
      ring.style.strokeDashoffset = String(circumference * (1 - percent / 100));
    }
    $('#ringPercent').textContent = percent + '%';
    $('#statTodo').textContent = String(pending);
    $('#statDone').textContent = String(done);
    $('#statOverdue').textContent = String(overdue);
    $('#greeting').textContent = greetingText();

    var headline;
    var sub;
    if (ui.view.type === 'completed') {
      headline = done ? '一共完成 ' + done + ' 项任务' : '还没有完成的任务';
      sub = done ? '回顾一下，你一直在前进。' : '完成第一项任务，记录你的进展。';
    } else if (!total) {
      headline = ui.view.type === 'myday' ? '今天想完成什么？' : '这里还没有任务';
      sub = '在下方添加第一项任务，开始今天的节奏。';
    } else if (!pending) {
      headline = '全部完成，干得漂亮';
      sub = '共完成 ' + done + ' 项任务，给自己一点奖励吧。';
    } else {
      headline = '还有 ' + pending + ' 项待完成';
      sub = done + ' / ' + total + ' 已完成' + (overdue ? ' · ' + overdue + ' 项已逾期' : '');
    }
    $('#heroHeadline').textContent = headline;
    $('#heroSub').textContent = sub;
  }

  function renderComposerOptions() {
    var select = $('#newTaskList');
    if (!select) return;
    var previous = select.value;
    select.innerHTML = state.lists.map(function (list) {
      return '<option value="' + esc(list.id) + '">' + esc(list.name) + '</option>';
    }).join('');

    var target = ui.view.type === 'list' ? ui.view.id : previous;
    if (!target || !findList(target)) target = state.lists[0].id;
    select.value = target;

    var input = $('#newTaskInput');
    var currentList = findList(ui.view.id);
    input.placeholder = (ui.view.type === 'list' && currentList)
      ? '添加到「' + currentList.name + '」…'
      : '添加任务，按 Enter 确认…';

    updateStarButton();
  }

  function renderListBar() {
    var scoped = ui.query.trim() ? getVisibleTasks() : getViewTasks();
    var pending = scoped.filter(function (t) { return !t.done; }).length;
    var done = scoped.length - pending;
    $('#listSummary').textContent = scoped.length
      ? pending + ' 项待完成 · ' + done + ' 项已完成'
      : '暂无任务';

    var toggle = $('#completedToggle');
    var shouldHide = ui.view.type === 'completed' || !!ui.query.trim() || done === 0;
    toggle.hidden = shouldHide;
    if (!shouldHide) {
      toggle.textContent = state.settings.showCompleted ? '隐藏已完成' : '显示已完成 · ' + done;
    }
  }

  function buildGroups(scoped) {
    var groups = [];
    var q = ui.query.trim();
    if (q) {
      return [{ key: 'search', title: '搜索结果 · ' + scoped.length, tasks: sortTasks(scoped), noCount: true }];
    }

    var pending = sortTasks(scoped.filter(function (t) { return !t.done; }));
    var done = sortTasks(scoped.filter(function (t) { return t.done; }));

    if (ui.view.type === 'completed') {
      return [{ key: 'done', title: '已完成', tasks: done }];
    }

    if (ui.view.type === 'planned') {
      var buckets = [
        { key: 'overdue', title: '已逾期', min: -100000, max: -1 },
        { key: 'today', title: '今天', min: 0, max: 0 },
        { key: 'tomorrow', title: '明天', min: 1, max: 1 },
        { key: 'week', title: '接下来 7 天', min: 2, max: 7 },
        { key: 'later', title: '以后', min: 8, max: 100000 }
      ];
      buckets.forEach(function (bucket) {
        var list = pending.filter(function (t) {
          var diff = diffDays(t.due);
          return diff >= bucket.min && diff <= bucket.max;
        });
        if (list.length) groups.push({ key: bucket.key, title: bucket.title, tasks: list, count: list.length });
      });
    } else if (ui.view.type === 'all') {
      state.lists.forEach(function (list) {
        var listTasks = pending.filter(function (t) { return t.listId === list.id; });
        if (listTasks.length) groups.push({ key: list.id, title: list.name, color: list.color, tasks: listTasks, count: listTasks.length });
      });
      var known = {};
      state.lists.forEach(function (l) { known[l.id] = true; });
      var orphans = pending.filter(function (t) { return !known[t.listId]; });
      if (orphans.length) groups.push({ key: 'other', title: '其他', tasks: orphans, count: orphans.length });
    } else if (pending.length) {
      groups.push({ key: 'pending', title: '待完成', tasks: pending, count: pending.length, hideHead: true });
    }

    if (done.length) {
      groups.push({
        key: 'done',
        title: '已完成',
        tasks: done,
        count: done.length,
        collapsible: true,
        collapsed: !state.settings.showCompleted
      });
    }
    return groups;
  }

  function inlineStepHTML(step) {
    return '<div class="inline-step' + (step.done ? ' done' : '') + '" data-step-id="' + esc(step.id) + '">' +
      '<input type="checkbox" ' + (step.done ? 'checked' : '') + ' aria-label="完成步骤" />' +
      '<span>' + esc(step.text) + '</span>' +
      '<button type="button" class="inline-step-del" data-action="delete-inline-step" aria-label="删除步骤">' + icon('close') + '</button>' +
    '</div>';
  }

  function taskHTML(task) {
    var list = findList(task.listId);
    var due = task.due ? dueMeta(task.due) : null;
    var stepDone = task.steps.filter(function (s) { return s.done; }).length;
    var stepsOpen = !!ui.expandedSteps[task.id];
    var metas = [];

    if (list) {
      metas.push('<span class="meta-item"><i style="background:' + list.color + '"></i>' + esc(list.name) + '</span>');
    }
    if (due) {
      metas.push('<span class="meta-item due ' + due.cls + '">' + icon('calendar') + esc(due.label) + '</span>');
    }
    metas.push('<button type="button" class="meta-item step-toggle' + (stepsOpen ? ' open' : '') + '" data-action="toggle-steps" aria-expanded="' + (stepsOpen ? 'true' : 'false') + '" title="' + (stepsOpen ? '收起步骤' : '展开步骤') + '">' +
      icon('step') + '步骤' + (task.steps.length ? ' ' + stepDone + '/' + task.steps.length : '') +
      '<span class="step-chev">' + icon('chevronDown') + '</span>' +
    '</button>');
    if (task.note) {
      metas.push('<span class="meta-item">' + icon('note') + '备注</span>');
    }

    var stepsPanel = '';
    if (stepsOpen) {
      stepsPanel = '<div class="task-steps">' +
        '<div class="inline-steps">' +
          (task.steps.length ? task.steps.map(inlineStepHTML).join('') : '<p class="inline-steps-empty">还没有步骤，添加一个吧。</p>') +
        '</div>' +
        '<div class="inline-step-add">' +
          '<input type="text" class="inline-step-input" placeholder="添加步骤，按 Enter 保存" maxlength="120" autocomplete="off" />' +
          '<button type="button" class="icon-btn tiny" data-action="add-inline-step" aria-label="添加步骤">' + icon('plus') + '</button>' +
        '</div>' +
      '</div>';
    }

    return '<article class="task' + (task.done ? ' done' : '') + (task.important ? ' important' : '') + '" data-id="' + esc(task.id) + '">' +
      '<button type="button" class="check" data-action="toggle-done" aria-label="' + (task.done ? '标记为未完成' : '标记为完成') + '">' + icon('check') + '</button>' +
      '<div class="task-main" data-action="open-task" role="button" tabindex="0" aria-label="打开任务详情">' +
        '<div class="task-line"><span class="task-title">' + esc(task.title) + '</span>' +
          (task.important ? '<span class="task-imp" title="重要" aria-label="重要">' + icon('star') + '</span>' : '') +
        '</div>' +
        (metas.length ? '<div class="task-meta">' + metas.join('') + '</div>' : '') +
      '</div>' +
      '<div class="task-actions">' +
        '<button type="button" class="mini-action' + (task.myDay ? ' active' : '') + '" data-action="toggle-myday" title="' + (task.myDay ? '移出我的一天' : '加入我的一天') + '" aria-label="我的一天">' + icon('sun') + '</button>' +
        '<button type="button" class="mini-action' + (task.important ? ' active' : '') + '" data-action="toggle-important" title="标记重要" aria-label="标记重要">' + icon('star') + '</button>' +
        '<button type="button" class="mini-action danger" data-action="delete-task" title="删除任务" aria-label="删除任务">' + icon('trash') + '</button>' +
      '</div>' +
      stepsPanel +
    '</article>';
  }

  function emptyStateHTML() {
    var title;
    var hint;
    var iconName = 'sparkles';

    if (ui.query.trim()) {
      title = '没有找到相关任务';
      hint = '换个关键词试试，或者清空搜索。';
      iconName = 'search';
    } else if (ui.view.type === 'myday') {
      title = '今天还没有安排';
      hint = '在上方添加任务，或点击任务右侧的太阳图标加入我的一天。';
      iconName = 'sun';
    } else if (ui.view.type === 'important') {
      title = '没有重要任务';
      hint = '把真正重要的事标上星标，集中注意力。';
      iconName = 'star';
    } else if (ui.view.type === 'planned') {
      title = '还没有安排日程';
      hint = '给任务加上日期，让计划更清晰。';
      iconName = 'calendar';
    } else if (ui.view.type === 'completed') {
      title = '还没有完成的任务';
      hint = '完成第一项任务，记录你的进展。';
      iconName = 'check';
    } else if (ui.view.type === 'list') {
      title = '这个清单还是空的';
      hint = '在上方输入任务，开始填充它。';
      iconName = 'list';
    } else {
      title = '一切清空，享受当下';
      hint = '新的任务随时可以加进来。';
      iconName = 'sparkles';
    }

    return '<div class="empty">' +
      '<div class="empty-mark">' + icon(iconName) + '</div>' +
      '<h3>' + title + '</h3>' +
      '<p>' + hint + '</p>' +
    '</div>';
  }

  function renderTasks() {
    var scoped = getVisibleTasks();
    var wrap = $('#taskScroll');
    if (!wrap) return;

    var animate = ui.animateNext;
    ui.animateNext = false;
    var scrollTop = wrap.scrollTop;

    if (!scoped.length) {
      wrap.innerHTML = emptyStateHTML();
      return;
    }

    var groups = buildGroups(scoped);
    wrap.innerHTML = groups.map(function (group) {
      var collapsed = group.collapsible && group.collapsed;
      var head = '';

      if (group.hideHead) {
        head = '';
      } else if (group.collapsible) {
        head = '<header class="group-head">' +
          '<button type="button" class="group-toggle' + (collapsed ? '' : ' open') + '" data-action="toggle-completed">' +
            icon('chevronDown') + '<h3>' + esc(group.title) + '</h3><span class="group-count">' + group.count + '</span>' +
          '</button>' +
        '</header>';
      } else {
        head = '<header class="group-head">' +
          (group.color ? '<span class="dot" style="background:' + group.color + '"></span>' : '') +
          '<h3>' + esc(group.title) + '</h3>' +
          (group.noCount ? '' : '<span class="group-count">' + (group.count != null ? group.count : group.tasks.length) + '</span>') +
        '</header>';
      }

      var body = collapsed ? '' : '<div class="task-list">' + group.tasks.map(taskHTML).join('') + '</div>';
      return '<section class="group">' + head + body + '</section>';
    }).join('');

    wrap.classList.remove('animate-in');
    wrap.scrollTop = scrollTop;

    if (animate) {
      // 强制一次重排，确保切换视图时重新播放淡入动画
      void wrap.offsetHeight;
      wrap.classList.add('animate-in');
      setTimeout(function () { wrap.classList.remove('animate-in'); }, 700);
    }
  }

  /* ---------------- 主题与壁纸 ---------------- */

  function isDarkTheme() {
    var mode = state.settings.theme;
    return mode === 'dark' || (mode === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  }

  function applyTheme() {
    var dark = isDarkTheme();
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');

    var accent = ACCENTS[state.settings.accent] || ACCENTS.emerald;
    var root = document.documentElement.style;
    root.setProperty('--accent', accent.color);
    root.setProperty('--accent-soft', accent.soft);
    root.setProperty('--accent-grad', accent.grad);

    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', dark ? '#0b1220' : '#eef2f9');

    var themeIcon = $('[data-action="toggle-theme"] .icon');
    if (themeIcon) themeIcon.innerHTML = icon(dark ? 'sun' : 'moon');
  }

  function applyWallpaper() {
    var wp = state.settings.wallpaper;
    var el = $('#wallpaper');
    if (!el) return;

    if (wp.image) {
      el.style.backgroundImage = 'url("' + String(wp.image).replace(/"/g, '%22') + '")';
    } else if (PRESETS[wp.preset]) {
      el.style.backgroundImage = PRESETS[wp.preset].css;
    } else {
      el.style.backgroundImage = PRESETS.aurora.css;
    }
    el.style.filter = wp.blur > 0 ? 'blur(' + wp.blur + 'px)' : 'none';
    el.style.transform = wp.blur > 0 ? 'scale(1.06)' : 'scale(1.02)';

    var scrim = $('#wallpaperScrim');
    if (scrim) scrim.style.opacity = String((wp.dim == null ? 22 : wp.dim) / 100);
  }

  function applySurface() {
    var settings = state.settings;
    var surface = isFinite(Number(settings.surface)) ? Number(settings.surface) : 62;
    var glassBlur = isFinite(Number(settings.glassBlur)) ? Number(settings.glassBlur) : 14;
    var alpha = surface / 100;
    var root = document.documentElement;

    root.style.setProperty('--panel-alpha', String(alpha));
    root.style.setProperty('--row-alpha', String(Math.max(0.55, alpha + 0.1)));
    root.style.setProperty('--control-alpha', String(Math.max(0.62, alpha)));
    root.style.setProperty('--side-alpha', String(Math.max(0.3, alpha)));
    root.style.setProperty('--glass-blur', glassBlur + 'px');
    // 低不透明度时自动切换为“通透模式”：任务行加对比底板，文字保持清晰
    root.setAttribute('data-clear', alpha < 0.5 ? 'true' : 'false');
  }

  function setWallpaper(patch) {
    var wp = state.settings.wallpaper;
    Object.keys(patch).forEach(function (key) { wp[key] = patch[key]; });
    applyWallpaper();
    save();
    renderSettings();
  }

  function renderSettings() {
    var wp = state.settings.wallpaper;
    var grid = $('#wallpaperGrid');
    if (grid) {
      grid.innerHTML = Object.keys(PRESETS).map(function (key) {
        var preset = PRESETS[key];
        var active = !wp.image && wp.preset === key;
        return '<button type="button" class="wp-tile' + (active ? ' active' : '') + '" data-preset="' + key + '" style="background-image:' + preset.css + '" aria-label="' + preset.name + '">' +
          '<span>' + preset.name + '</span>' +
        '</button>';
      }).join('');
    }

    var customRow = $('#customWallpaperRow');
    if (customRow) customRow.hidden = !wp.image;

    var blurRange = $('#blurRange');
    if (blurRange) {
      blurRange.value = wp.blur;
      $('#blurOut').textContent = wp.blur + 'px';
      updateRangeFill(blurRange);
    }
    var dimRange = $('#dimRange');
    if (dimRange) {
      dimRange.value = wp.dim;
      $('#dimOut').textContent = wp.dim + '%';
      updateRangeFill(dimRange);
    }

    var surfaceRange = $('#surfaceRange');
    if (surfaceRange) {
      surfaceRange.value = state.settings.surface;
      $('#surfaceOut').textContent = state.settings.surface + '%';
      updateRangeFill(surfaceRange);
    }
    var glassBlurRange = $('#glassBlurRange');
    if (glassBlurRange) {
      glassBlurRange.value = state.settings.glassBlur;
      $('#glassBlurOut').textContent = state.settings.glassBlur + 'px';
      updateRangeFill(glassBlurRange);
    }

    var accentRow = $('#accentRow');
    if (accentRow) {
      accentRow.innerHTML = Object.keys(ACCENTS).map(function (key) {
        var accent = ACCENTS[key];
        var active = state.settings.accent === key;
        return '<button type="button" class="accent-dot' + (active ? ' active' : '') + '" data-accent="' + key + '" style="--swatch:' + accent.color + '" title="' + accent.name + '" aria-label="' + accent.name + '">' +
          '<span></span>' +
        '</button>';
      }).join('');
    }

    $$('#themeRow [data-theme-set]').forEach(function (button) {
      button.classList.toggle('active', state.settings.theme === button.getAttribute('data-theme-set'));
    });
  }

  /* ---------------- 面板 ---------------- */

  function showOverlay() {
    $('#overlay').classList.add('show');
  }

  function hideOverlayIfIdle() {
    var drawerOpen = $('#drawer').classList.contains('open');
    var sheetOpen = $('#sheet').classList.contains('open');
    if (!drawerOpen && !sheetOpen) {
      $('#overlay').classList.remove('show');
      document.body.classList.remove('panel-open');
    }
  }

  function openDrawer(id) {
    var task = findTask(id);
    if (!task) return;
    closeSheet();
    ui.editingId = id;
    fillDrawer(task);
    $('#drawer').classList.add('open');
    $('#drawer').removeAttribute('inert');
    $('#drawer').setAttribute('aria-hidden', 'false');
    showOverlay();
    document.body.classList.add('panel-open');
  }

  function closeDrawer() {
    if (ui.editingId) {
      var editingTask = findTask(ui.editingId);
      if (editingTask && !String(editingTask.title || '').trim()) {
        editingTask.title = '未命名任务';
        save();
        $$('.task').some(function (el) {
          if (el.getAttribute('data-id') !== editingTask.id) return false;
          var titleEl = el.querySelector('.task-title');
          if (titleEl) titleEl.textContent = editingTask.title;
          return true;
        });
      }
    }
    var drawer = $('#drawer');
    drawer.classList.remove('open');
    drawer.setAttribute('inert', '');
    drawer.setAttribute('aria-hidden', 'true');
    ui.editingId = null;
    hideOverlayIfIdle();
  }

  function openSheet() {
    closeDrawer();
    closeSidebar();
    renderSettings();
    $('#wallpaperUrlRow').hidden = true;
    $('#sheet').classList.add('open');
    $('#sheet').removeAttribute('inert');
    $('#sheet').setAttribute('aria-hidden', 'false');
    showOverlay();
    document.body.classList.add('panel-open');
  }

  function closeSheet() {
    var sheet = $('#sheet');
    sheet.classList.remove('open');
    sheet.setAttribute('inert', '');
    sheet.setAttribute('aria-hidden', 'true');
    hideOverlayIfIdle();
  }

  function closeAllPanels() {
    closeDrawer();
    closeSheet();
  }

  /* ---------------- 详情面板 ---------------- */

  function fillDrawer(task) {
    var title = $('#detailTitle');
    title.value = task.title;
    autoGrow(title);

    var select = $('#detailList');
    select.innerHTML = state.lists.map(function (list) {
      return '<option value="' + esc(list.id) + '">' + esc(list.name) + '</option>';
    }).join('');
    select.value = task.listId;

    $('#detailDue').value = task.due || '';
    $('#detailNote').value = task.note || '';
    syncDrawer(task);
  }

  function syncDrawer(task) {
    $('#detailCheck').classList.toggle('done', !!task.done);
    $('#detailImportant').classList.toggle('active', !!task.important);
    $('#detailMyDay').classList.toggle('active', !!task.myDay);
    $('#detailMeta').textContent = '创建于 ' + formatStamp(task.createdAt) +
      (task.completedAt ? ' · 完成于 ' + formatStamp(task.completedAt) : '');
  }

  function autoGrow(el) {
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 180) + 'px';
  }

  function findTaskCard(id) {
    var cards = document.querySelectorAll('.task');
    for (var i = 0; i < cards.length; i++) {
      if (cards[i].getAttribute('data-id') === id) return cards[i];
    }
    return null;
  }

  function addInlineStep(taskId) {
    var task = findTask(taskId);
    if (!task) return;
    var card = findTaskCard(taskId);
    if (!card) return;
    var input = card.querySelector('.inline-step-input');
    if (!input) return;
    var text = input.value.trim();
    if (!text) {
      input.focus();
      return;
    }

    task.steps.push({ id: uid(), text: text, done: false });
    save();
    render();

    var newCard = findTaskCard(taskId);
    if (newCard) {
      var newInput = newCard.querySelector('.inline-step-input');
      if (newInput) newInput.focus();
    }
  }

  function deleteInlineStep(button) {
    var card = button.closest('.task');
    if (!card) return;
    var task = findTask(card.getAttribute('data-id'));
    if (!task) return;
    var stepEl = button.closest('.inline-step');
    if (!stepEl) return;
    var stepId = stepEl.getAttribute('data-step-id');
    task.steps = task.steps.filter(function (step) { return step.id !== stepId; });
    save();
    render();
  }

  function onInlineStepChange(event) {
    var checkbox = event.target.closest('.inline-step input[type="checkbox"]');
    if (!checkbox) return;
    var card = checkbox.closest('.task');
    if (!card) return;
    var task = findTask(card.getAttribute('data-id'));
    if (!task) return;
    var stepEl = checkbox.closest('.inline-step');
    if (!stepEl) return;
    var stepId = stepEl.getAttribute('data-step-id');
    task.steps.forEach(function (step) {
      if (step.id === stepId) step.done = checkbox.checked;
    });
    save();
    render();
  }

  function updateStarButton() {
    var button = $('#newTaskStar');
    if (button) button.classList.toggle('active', !!ui.newImportant);
  }

  function updateRangeFill(input) {
    if (!input) return;
    var min = Number(input.min) || 0;
    var max = Number(input.max) || 100;
    var value = Number(input.value);
    var percent = max > min ? ((value - min) / (max - min)) * 100 : 0;
    input.style.setProperty('--fill', percent + '%');
  }

  /* ---------------- Toast ---------------- */

  function showToast(message, undo) {
    var toast = $('#toast');
    toast.innerHTML = '<span class="toast-msg">' + esc(message) + '</span>' +
      (undo ? '<button type="button" class="toast-btn">撤销</button>' : '');
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove('show');
    }, 4500);

    if (undo) {
      var undoButton = toast.querySelector('.toast-btn');
      undoButton.addEventListener('click', function () {
        clearTimeout(toastTimer);
        toast.classList.remove('show');
        undo();
      });
    }
  }

  /* ---------------- 任务操作 ---------------- */

  function setView(view) {
    ui.view = view;
    ui.query = '';
    ui.animateNext = true;
    var search = $('#searchInput');
    search.value = '';
    $('#searchClear').hidden = true;
    closeSidebar();
    render();
    var scroll = $('#taskScroll');
    if (scroll) scroll.scrollTop = 0;
  }

  function addTaskFromComposer(event) {
    event.preventDefault();
    var input = $('#newTaskInput');
    var title = input.value.trim();
    if (!title) {
      input.focus();
      return;
    }

    var listId = $('#newTaskList').value;
    if (!findList(listId)) listId = state.lists[0].id;

    var due = $('#newTaskDue').value;
    if (!isDateKey(due)) due = '';
    if (!due && ui.view.type === 'planned') due = todayKey();

    var task = {
      id: uid(),
      title: title,
      listId: listId,
      done: false,
      important: ui.view.type === 'important' ? true : ui.newImportant,
      myDay: ui.view.type === 'myday',
      due: due,
      note: '',
      steps: [],
      createdAt: Date.now(),
      completedAt: null
    };

    state.tasks.unshift(task);
    input.value = '';
    $('#newTaskDue').value = '';
    ui.newImportant = false;
    if (ui.query.trim()) {
      ui.query = '';
      $('#searchInput').value = '';
      $('#searchClear').hidden = true;
    }
    save();

    if (ui.view.type === 'completed') ui.view = { type: 'all', id: null };
    render();
    input.focus();

    var addedEl = null;
    $$('.task').some(function (el) {
      if (el.getAttribute('data-id') === task.id) {
        addedEl = el;
        return true;
      }
      return false;
    });
    if (addedEl) addedEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    showToast('已添加：' + truncate(title, 22));
  }

  function toggleDone(id) {
    var task = findTask(id);
    if (!task) return;
    task.done = !task.done;
    task.completedAt = task.done ? Date.now() : null;
    save();
    render();
    if (ui.editingId === id) syncDrawer(task);
  }

  function toggleImportant(id) {
    var task = findTask(id);
    if (!task) return;
    task.important = !task.important;
    save();
    render();
    if (ui.editingId === id) syncDrawer(task);
    showToast(task.important ? '已标记为重要' : '已取消重要标记');
  }

  function toggleMyDay(id) {
    var task = findTask(id);
    if (!task) return;
    task.myDay = !task.myDay;
    save();
    render();
    if (ui.editingId === id) syncDrawer(task);
    showToast(task.myDay ? '已加入「我的一天」' : '已移出「我的一天」');
  }

  function deleteTask(id) {
    var index = state.tasks.findIndex(function (t) { return t.id === id; });
    if (index < 0) return;
    var removed = state.tasks[index];
    var wasExpanded = !!ui.expandedSteps[id];
    state.tasks.splice(index, 1);
    delete ui.expandedSteps[id];
    if (ui.editingId === id) closeDrawer();
    save();
    render();
    showToast('已删除「' + truncate(removed.title, 18) + '」', function () {
      state.tasks.splice(Math.min(index, state.tasks.length), 0, removed);
      if (wasExpanded) ui.expandedSteps[id] = true;
      save();
      render();
      showToast('已恢复任务');
    });
  }

  function toggleCompleted() {
    state.settings.showCompleted = !state.settings.showCompleted;
    save();
    render();
  }

  function createList(name) {
    var list = {
      id: uid(),
      name: name,
      color: LIST_COLORS[state.lists.length % LIST_COLORS.length]
    };
    state.lists.push(list);
    save();
    render();
    setView({ type: 'list', id: list.id });
    showToast('已创建清单「' + name + '」');
  }

  function deleteList(id) {
    if (state.lists.length <= 1) {
      showToast('至少保留一个清单');
      return;
    }
    var list = findList(id);
    if (!list) return;
    var index = state.lists.indexOf(list);
    var removedTasks = state.tasks.filter(function (t) { return t.listId === id; });
    var removedEditing = ui.editingId && removedTasks.some(function (t) { return t.id === ui.editingId; });

    state.lists.splice(index, 1);
    state.tasks = state.tasks.filter(function (t) { return t.listId !== id; });
    if (ui.view.type === 'list' && ui.view.id === id) ui.view = { type: 'all', id: null };
    if (removedEditing) closeDrawer();

    save();
    render();
    showToast('已删除清单「' + truncate(list.name, 12) + '」及 ' + removedTasks.length + ' 项任务', function () {
      state.lists.splice(Math.min(index, state.lists.length), 0, list);
      removedTasks.forEach(function (task) { state.tasks.push(task); });
      save();
      render();
      showToast('已恢复清单');
    });
  }

  function clearSearch() {
    ui.query = '';
    var input = $('#searchInput');
    input.value = '';
    $('#searchClear').hidden = true;
    render();
    input.focus();
  }

  function toggleTheme() {
    state.settings.theme = isDarkTheme() ? 'light' : 'dark';
    applyTheme();
    save();
    if ($('#sheet').classList.contains('open')) renderSettings();
  }

  function openSidebar() {
    $('#sidebar').classList.add('open');
  }

  function closeSidebar() {
    $('#sidebar').classList.remove('open');
  }

  function showNewListForm() {
    var form = $('#newListForm');
    if (!form.hidden) {
      hideNewListForm();
      return;
    }
    form.hidden = false;
    $('#newListInput').focus();
  }

  function hideNewListForm() {
    var form = $('#newListForm');
    form.hidden = true;
    $('#newListInput').value = '';
  }

  /* ---------------- 数据导入导出 ---------------- */

  function exportData(filename) {
    var isPublish = filename === DATA_FILE;
    if (isPublish) state.updatedAt = Date.now();
    persistNow();

    var payload = {
      app: 'SPM Plan',
      version: 1,
      updatedAt: state.updatedAt,
      exportedAt: new Date().toISOString(),
      lists: state.lists,
      tasks: state.tasks,
      settings: state.settings
    };
    var blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url;
    link.download = filename || ('spm-plan-' + todayKey() + '.json');
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
    showToast(isPublish
      ? '已下载 tasks.json，上传替换仓库里的同名文件即可'
      : '已导出 JSON 备份');
  }

  function importData(raw) {
    var data;
    try {
      data = JSON.parse(raw);
    } catch (err) {
      showToast('文件不是有效的 JSON');
      return;
    }
    var next = normalize(data);
    if (!next) {
      showToast('JSON 结构不正确：需要 tasks 与 lists 数组');
      return;
    }

    var listIds = {};
    state.lists.forEach(function (list) { listIds[list.id] = true; });
    next.lists.forEach(function (list) {
      if (!listIds[list.id]) {
        state.lists.push(list);
        listIds[list.id] = true;
      }
    });

    var taskIds = {};
    state.tasks.forEach(function (task) { taskIds[task.id] = true; });
    var added = 0;
    next.tasks.forEach(function (task) {
      if (taskIds[task.id]) return;
      if (!listIds[task.listId]) task.listId = state.lists[0].id;
      state.tasks.push(task);
      taskIds[task.id] = true;
      added += 1;
    });

    save();
    render();
    showToast(added ? '已导入 ' + added + ' 项任务' : '没有新的任务可导入');
  }

  function onImportFile(event) {
    var file = event.target.files && event.target.files[0];
    event.target.value = '';
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function () { importData(String(reader.result)); };
    reader.onerror = function () { showToast('文件读取失败'); };
    reader.readAsText(file, 'utf-8');
  }

  /* ---------------- 壁纸 ---------------- */

  function onWallpaperFile(event) {
    var file = event.target.files && event.target.files[0];
    event.target.value = '';
    if (!file) return;
    if (!/^image\//.test(file.type)) {
      showToast('请选择图片文件');
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      showToast('图片太大了，请选择 12MB 以内的图片');
      return;
    }

    var reader = new FileReader();
    reader.onload = function () {
      var image = new Image();
      image.onload = function () {
        try {
          var maxSide = 1600;
          var scale = Math.min(1, maxSide / Math.max(image.width, image.height));
          var width = Math.max(1, Math.round(image.width * scale));
          var height = Math.max(1, Math.round(image.height * scale));
          var canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          var ctx = canvas.getContext('2d');
          ctx.fillStyle = '#0b1220';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(image, 0, 0, width, height);

          var dataUrl = canvas.toDataURL('image/jpeg', 0.84);
          if (dataUrl.length > 2000000) {
            var smallW = Math.max(1, Math.round(width * 0.72));
            var smallH = Math.max(1, Math.round(height * 0.72));
            canvas.width = smallW;
            canvas.height = smallH;
            var ctx2 = canvas.getContext('2d');
            ctx2.fillStyle = '#0b1220';
            ctx2.fillRect(0, 0, smallW, smallH);
            ctx2.drawImage(image, 0, 0, smallW, smallH);
            dataUrl = canvas.toDataURL('image/jpeg', 0.72);
          }
          if (dataUrl.length > 3500000) {
            showToast('图片压缩后仍然太大，请换一张试试');
            return;
          }
          setWallpaper({ image: dataUrl });
          showToast('壁纸已更新');
        } catch (err) {
          showToast('图片处理失败，请换一张试试');
        }
      };
      image.onerror = function () { showToast('图片读取失败'); };
      image.src = String(reader.result);
    };
    reader.onerror = function () { showToast('文件读取失败'); };
    reader.readAsDataURL(file);
  }

  function applyWallpaperUrl() {
    var input = $('#wallpaperUrl');
    var url = input.value.trim();
    if (!/^(https?:\/\/|data:image\/)/i.test(url)) {
      showToast('请输入以 http(s) 开头的图片地址');
      return;
    }
    setWallpaper({ image: url });
    $('#wallpaperUrlRow').hidden = true;
    input.value = '';
    showToast('壁纸已更新');
  }

  function resetWallpaper() {
    state.settings.wallpaper = { preset: 'aurora', image: '', blur: 0, dim: 22 };
    applyWallpaper();
    save();
    renderSettings();
    showToast('已恢复默认壁纸');
  }

  /* ---------------- 事件 ---------------- */

  function bindEvents() {
    document.addEventListener('click', onActionClick);
    $('#smartNav').addEventListener('click', onSmartNavClick);
    $('#listNav').addEventListener('click', onListNavClick);

    $('#searchInput').addEventListener('input', function (event) {
      ui.query = event.target.value;
      $('#searchClear').hidden = !ui.query.trim();
      render();
    });

    $('#composer').addEventListener('submit', addTaskFromComposer);
    $('#newListForm').addEventListener('submit', function (event) {
      event.preventDefault();
      var input = $('#newListInput');
      var name = input.value.trim();
      if (!name) {
        input.focus();
        return;
      }
      if (state.lists.some(function (list) { return list.name === name; })) {
        showToast('已经有同名清单了');
        return;
      }
      hideNewListForm();
      createList(name);
    });
    $('#newListInput').addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        event.stopPropagation();
        hideNewListForm();
      }
    });

    $('#detailTitle').addEventListener('input', onDetailTitleInput);
    $('#detailTitle').addEventListener('blur', onDetailTitleBlur);
    $('#detailTitle').addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        event.target.blur();
      }
    });
    $('#detailDue').addEventListener('change', function (event) {
      var task = findTask(ui.editingId);
      if (!task) return;
      task.due = isDateKey(event.target.value) ? event.target.value : '';
      save();
      render();
      syncDrawer(task);
    });
    $('#detailList').addEventListener('change', function (event) {
      var task = findTask(ui.editingId);
      if (!task) return;
      if (findList(event.target.value)) task.listId = event.target.value;
      save();
      render();
    });
    $('#detailNote').addEventListener('input', function (event) {
      var task = findTask(ui.editingId);
      if (!task) return;
      task.note = event.target.value;
      save();
    });
    $('#detailNote').addEventListener('blur', function () { render(); });

    $('#taskScroll').addEventListener('change', onInlineStepChange);
    $('#taskScroll').addEventListener('keydown', function (event) {
      if (event.key !== 'Enter') return;
      var input = event.target.closest('.inline-step-input');
      if (!input) return;
      var card = input.closest('.task');
      if (!card) return;
      event.preventDefault();
      event.stopPropagation();
      addInlineStep(card.getAttribute('data-id'));
    });

    $('#wallpaperGrid').addEventListener('click', function (event) {
      var tile = event.target.closest('[data-preset]');
      if (!tile) return;
      setWallpaper({ preset: tile.getAttribute('data-preset'), image: '' });
      showToast('已更换壁纸');
    });

    $('#accentRow').addEventListener('click', function (event) {
      var dot = event.target.closest('[data-accent]');
      if (!dot) return;
      var key = dot.getAttribute('data-accent');
      if (!ACCENTS[key]) return;
      state.settings.accent = key;
      applyTheme();
      save();
      renderSettings();
    });

    $('#themeRow').addEventListener('click', function (event) {
      var button = event.target.closest('[data-theme-set]');
      if (!button) return;
      state.settings.theme = button.getAttribute('data-theme-set');
      applyTheme();
      save();
      renderSettings();
    });

    $('#blurRange').addEventListener('input', function (event) {
      state.settings.wallpaper.blur = Number(event.target.value) || 0;
      $('#blurOut').textContent = state.settings.wallpaper.blur + 'px';
      updateRangeFill(event.target);
      applyWallpaper();
      save();
    });
    $('#dimRange').addEventListener('input', function (event) {
      state.settings.wallpaper.dim = Number(event.target.value) || 0;
      $('#dimOut').textContent = state.settings.wallpaper.dim + '%';
      updateRangeFill(event.target);
      applyWallpaper();
      save();
    });
    $('#surfaceRange').addEventListener('input', function (event) {
      state.settings.surface = Number(event.target.value) || 62;
      $('#surfaceOut').textContent = state.settings.surface + '%';
      updateRangeFill(event.target);
      applySurface();
      save();
    });
    $('#glassBlurRange').addEventListener('input', function (event) {
      state.settings.glassBlur = Number(event.target.value) || 0;
      $('#glassBlurOut').textContent = state.settings.glassBlur + 'px';
      updateRangeFill(event.target);
      applySurface();
      save();
    });

    $('#wallpaperFile').addEventListener('change', onWallpaperFile);
    $('#importFile').addEventListener('change', onImportFile);
    $('#wallpaperUrl').addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        applyWallpaperUrl();
      }
    });
    $('#overlay').addEventListener('click', closeAllPanels);
    $('#sidebar').addEventListener('click', function (event) {
      if (event.target.closest('[data-list]') || event.target.closest('[data-view]')) {
        closeSidebar();
      }
    });

    document.addEventListener('keydown', onKeydown);
    document.addEventListener('click', function (event) {
      var sidebar = $('#sidebar');
      if (!sidebar.classList.contains('open')) return;
      if (!event.target || !event.target.closest) return;
      if (event.target.closest('#sidebar')) return;
      if (event.target.closest('[data-action="toggle-sidebar"]')) return;
      closeSidebar();
    });
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden') persistNow();
    });
    window.addEventListener('beforeunload', persistNow);

    try {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
        if (state.settings.theme === 'auto') applyTheme();
      });
    } catch (err) { /* 老版本浏览器忽略 */ }
  }

  function onSmartNavClick(event) {
    var button = event.target.closest('[data-view]');
    if (!button) return;
    setView({ type: button.getAttribute('data-view'), id: null });
  }

  function onListNavClick(event) {
    if (event.target.closest('[data-action="delete-list"]')) return;
    var button = event.target.closest('[data-list]');
    if (!button) return;
    setView({ type: 'list', id: button.getAttribute('data-list') });
  }

  function onDetailTitleInput(event) {
    var task = findTask(ui.editingId);
    if (!task) return;
    task.title = event.target.value;
    autoGrow(event.target);
    save();
    // 直接更新列表中的标题，避免每次输入都重绘整个列表
    $$('.task').some(function (el) {
      if (el.getAttribute('data-id') !== task.id) return false;
      var titleEl = el.querySelector('.task-title');
      if (titleEl) titleEl.textContent = task.title;
      return true;
    });
  }

  function onDetailTitleBlur(event) {
    var task = findTask(ui.editingId);
    if (!task) return;
    if (!task.title.trim()) {
      task.title = '未命名任务';
      event.target.value = task.title;
      save();
      render();
    }
  }

  function onActionClick(event) {
    if (!event.target || !event.target.closest) return;
    var actionEl = event.target.closest('[data-action]');
    if (!actionEl) return;
    var action = actionEl.getAttribute('data-action');
    var taskEl = actionEl.closest('.task');
    var taskId = taskEl ? taskEl.getAttribute('data-id') : null;

    switch (action) {
      case 'toggle-sidebar':
        openSidebar();
        break;
      case 'close-sidebar':
        closeSidebar();
        break;
      case 'clear-search':
        clearSearch();
        break;
      case 'new-list':
        showNewListForm();
        break;
      case 'delete-list':
        deleteList(actionEl.getAttribute('data-list-id'));
        break;
      case 'open-settings':
        openSheet();
        break;
      case 'close-settings':
        closeSheet();
        break;
      case 'toggle-theme':
        toggleTheme();
        break;
      case 'export-data':
        exportData();
        break;
      case 'export-repo':
        exportData(DATA_FILE);
        break;
      case 'sync-repo':
        syncRepo(true, false);
        break;
      case 'apply-remote':
        if (pendingRemote) {
          applyRemoteState(pendingRemote, false);
        } else {
          syncRepo(true, false);
        }
        break;
      case 'dismiss-remote':
        hideSyncBanner();
        break;
      case 'reset-wallpaper':
        resetWallpaper();
        break;
      case 'remove-wallpaper':
        setWallpaper({ image: '', preset: 'aurora' });
        showToast('已移除自定义图片');
        break;
      case 'wallpaper-url': {
        var row = $('#wallpaperUrlRow');
        row.hidden = !row.hidden;
        if (!row.hidden) $('#wallpaperUrl').focus();
        break;
      }
      case 'apply-url':
        applyWallpaperUrl();
        break;
      case 'toggle-new-important':
        ui.newImportant = !ui.newImportant;
        updateStarButton();
        break;
      case 'toggle-done':
        if (taskId) toggleDone(taskId);
        break;
      case 'open-task':
        if (taskId) openDrawer(taskId);
        break;
      case 'toggle-myday':
        if (taskId) toggleMyDay(taskId);
        break;
      case 'toggle-important':
        if (taskId) toggleImportant(taskId);
        break;
      case 'delete-task':
        if (taskId) deleteTask(taskId);
        break;
      case 'toggle-completed':
        toggleCompleted();
        break;
      case 'close-drawer':
        closeDrawer();
        break;
      case 'delete-current':
        if (ui.editingId) deleteTask(ui.editingId);
        break;
      case 'toggle-done-current':
        if (ui.editingId) toggleDone(ui.editingId);
        break;
      case 'detail-important': {
        if (!ui.editingId) break;
        var task = findTask(ui.editingId);
        if (!task) break;
        task.important = !task.important;
        save();
        render();
        syncDrawer(task);
        break;
      }
      case 'detail-myday': {
        if (!ui.editingId) break;
        var myDayTask = findTask(ui.editingId);
        if (!myDayTask) break;
        myDayTask.myDay = !myDayTask.myDay;
        save();
        render();
        syncDrawer(myDayTask);
        break;
      }
      case 'toggle-steps':
        if (taskId) {
          ui.expandedSteps[taskId] = !ui.expandedSteps[taskId];
          render();
        }
        break;
      case 'add-inline-step':
        if (taskId) addInlineStep(taskId);
        break;
      case 'delete-inline-step':
        deleteInlineStep(actionEl);
        break;
      default:
        break;
    }
  }

  function onKeydown(event) {
    if (event.key === 'Escape') {
      if ($('#drawer').classList.contains('open') || $('#sheet').classList.contains('open')) {
        closeAllPanels();
      } else if ($('#sidebar').classList.contains('open')) {
        closeSidebar();
      }
      return;
    }

    if (event.metaKey || event.ctrlKey || event.altKey) return;
    if ($('#drawer').classList.contains('open') || $('#sheet').classList.contains('open')) return;

    var target = event.target;
    var tag = target && target.tagName ? target.tagName.toLowerCase() : '';
    var typing = tag === 'input' || tag === 'textarea' || tag === 'select' || (target && target.isContentEditable);
    if (typing) return;

    // 任务行里的按钮自己处理 Enter，不要再打开详情面板
    if (event.key === 'Enter' && target && target.closest && target.closest('button, a')) return;

    if (target && target.closest && target.closest('.task-main') && event.key === 'Enter') {
      event.preventDefault();
      var taskEl = target.closest('.task');
      if (taskEl) openDrawer(taskEl.getAttribute('data-id'));
      return;
    }

    if (event.key === '/') {
      event.preventDefault();
      $('#searchInput').focus();
    } else if (event.key && event.key.toLowerCase() === 'n') {
      event.preventDefault();
      $('#newTaskInput').focus();
    }
  }

  /* ---------------- 启动 ---------------- */

  function hydrateIcons() {
    $$('[data-icon]').forEach(function (el) {
      el.innerHTML = icon(el.getAttribute('data-icon'));
    });
  }

  function init() {
    var raw = null;
    try { raw = localStorage.getItem(STORAGE_KEY); } catch (err) { raw = null; }

    var stored = loadState();
    var firstRun = !stored;
    var recovered = false;
    state = stored;
    if (!state) {
      state = seedState();
      if (raw) {
        recovered = true;
        try { localStorage.setItem(STORAGE_KEY + '-backup-' + Date.now(), raw); } catch (err) { /* 忽略 */ }
      }
    }
    lastContentSignature = contentSignature();

    hydrateIcons();
    bindEvents();
    applyTheme();
    applySurface();
    applyWallpaper();
    ui.animateNext = true;
    render();
    if (firstRun) persistNow();
    if (recovered) showToast('本地数据异常，已备份原始内容并载入示例数据');

    // GitHub Pages 下自动读取仓库里的 tasks.json；本地 file:// 模式跳过
    syncRepo(false, firstRun);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
