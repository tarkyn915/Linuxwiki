# 系统优化

## Winhance

全部设置直接用软件里的推荐项：https://github.com/memstechtips/Winhance

## 性能选项

打开 `sysdm.cpl` → 高级 → 性能 → 设置，选「调整为最佳性能」，然后勾回这三项：

- **平滑屏幕字体边缘**
- **显示缩略图，而不是显示图标**
- **拖动时显示窗口内容**

再在 `设置 → 辅助功能 → 视觉效果` 里关掉：

- 动画效果
- 透明效果

## 经典右键菜单

恢复 Win10 那套右键菜单：

```powershell
reg.exe add "HKCU\Software\Classes\CLSID\{86ca1aa0-34aa-4e8b-a509-50c905bae2a2}\InprocServer32" /f /ve
```

```powershell
taskkill /f /im explorer.exe ; start explorer.exe
```

## 显示资源占用

Sidebar Diagnostics，在桌面侧边栏显示 CPU、内存、网速等：https://github.com/ArcadeRenegade/SidebarDiagnostics
