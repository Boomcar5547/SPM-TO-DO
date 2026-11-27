# =====================================================================
#  C: drive READ-ONLY audit.  Does not delete or modify anything.
#  Output: M:\github\SPM plan\c-drive-audit.txt
# =====================================================================
$ErrorActionPreference = 'SilentlyContinue'
$ProgressPreference    = 'SilentlyContinue'
$out = 'M:\github\SPM plan\c-drive-audit.txt'
$me  = $env:USERPROFILE

function L($t) { $t | Out-File -LiteralPath $out -Append -Encoding UTF8 }
function SZ([string]$p) {
  if (-not (Test-Path -LiteralPath $p)) { return $null }
  $s = (Get-ChildItem -LiteralPath $p -Force -Recurse -File -ErrorAction SilentlyContinue |
        Measure-Object -Property Length -Sum).Sum
  if ($null -eq $s) { return [double]0 }
  return [double]$s
}
function FMT($bytes) {
  if ($null -eq $bytes) { return 'N/A' }
  return ('{0:N1} MB' -f ($bytes / 1MB))
}

"# C: drive audit  $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" | Out-File -LiteralPath $out -Encoding UTF8
L ("Host: {0}   User: {1}" -f $env:COMPUTERNAME, $env:USERNAME)
L ""

# ---------- 1 ----------
L "## 1. Disk"
$d = Get-CimInstance Win32_LogicalDisk -Filter "DeviceID='C:'"
if ($d) { L ('C: total {0:N1} GB | used {1:N1} GB | free {2:N1} GB' -f ($d.Size/1GB), (($d.Size-$d.FreeSpace)/1GB), ($d.FreeSpace/1GB)) }
$os = Get-CimInstance Win32_OperatingSystem
if ($os) { L ('OS: {0} | installed: {1}' -f $os.Caption, $os.InstallDate) }
L ""

# ---------- 2 ----------
L "## 2. Root files (hiberfil/pagefile/swapfile)"
Get-ChildItem 'C:\' -Force -File -ErrorAction SilentlyContinue | Sort-Object Length -Descending | ForEach-Object {
  $sz = FMT $_.Length
  L ('{0,-24} {1,14}   {2}' -f $_.Name, $sz, $_.LastWriteTime)
}
L ""

# ---------- 3 ----------
L "## 3. Top-level folders"
Get-ChildItem 'C:\' -Force -Directory -ErrorAction SilentlyContinue | Sort-Object Name | ForEach-Object {
  $sz = FMT (SZ $_.FullName)
  L ('{0,14} | {1} | {2}' -f $sz, $_.LastWriteTime.ToString('yyyy-MM-dd'), $_.FullName)
}
L ""

# ---------- 4 ----------
L "## 4. User profiles"
Get-ChildItem 'C:\Users' -Force -Directory -ErrorAction SilentlyContinue | ForEach-Object {
  $sz = FMT (SZ $_.FullName)
  L ('{0,14} | {1} | {2}' -f $sz, $_.LastWriteTime.ToString('yyyy-MM-dd'), $_.FullName)
}
L ""

# ---------- 5 ----------
L "## 5. Known cache / junk locations"
L "size | last-write | exists | path | note"
$targets = @(
  @('C:\Windows\Temp', 'system temp, safe to clear'),
  @('C:\Windows\SystemTemp', 'system temp'),
  @("$me\AppData\Local\Temp", 'user temp, safe to clear'),
  @('C:\Windows\SoftwareDistribution\Download', 'Windows Update download cache, safe to clear'),
  @('C:\Windows\SoftwareDistribution', 'update cache root'),
  @('C:\Windows\Prefetch', 'prefetch, safe to clear'),
  @('C:\Windows\Minidump', 'crash dumps'),
  @('C:\Windows\LiveKernelReports', 'kernel dumps'),
  @('C:\Windows\memory.dmp', 'full memory dump (often huge)'),
  @('C:\Windows\Panther', 'setup logs'),
  @('C:\Windows\Logs', 'system logs'),
  @('C:\Windows\Installer', 'MSI cache - DO NOT delete manually'),
  @('C:\Windows\WinSxS', 'component store - only via DISM'),
  @('C:\Windows.old', 'old OS backup, can delete'),
  @('C:\$WINDOWS.~BT', 'upgrade temp, can delete'),
  @('C:\$Windows.~WS', 'upgrade temp, can delete'),
  @('C:\$Recycle.Bin', 'recycle bin'),
  @('C:\ProgramData\Package Cache', 'installer cache (VS etc.), can clear'),
  @('C:\ProgramData\Microsoft\Windows\DeliveryOptimization', 'delivery optimization cache'),
  @('C:\ProgramData\Microsoft\Windows\WER', 'error reports'),
  @('C:\ProgramData\Microsoft\Windows\Defender\Definition Updates', 'old Defender definitions'),
  @('C:\ProgramData\Microsoft\Windows\Caches', 'thumb/icon cache'),
  @("$me\AppData\Local\CrashDumps", 'crash dumps'),
  @("$me\AppData\Local\Microsoft\Windows\INetCache", 'IE/system web cache'),
  @("$me\AppData\Local\Microsoft\Windows\Explorer", 'thumbnail cache'),
  @("$me\AppData\Local\Microsoft\Windows\WebCache", 'web cache db'),
  @("$me\AppData\Local\Microsoft\Edge\User Data", 'Edge data'),
  @("$me\AppData\Local\Google\Chrome\User Data", 'Chrome data'),
  @("$me\AppData\Local\pip\cache", 'pip cache'),
  @("$me\AppData\Local\npm-cache", 'npm cache'),
  @("$me\AppData\Local\pnpm", 'pnpm store'),
  @("$me\AppData\Local\Yarn", 'yarn cache'),
  @("$me\AppData\Local\Docker", 'Docker data'),
  @("$me\AppData\Local\Packages", 'UWP app data'),
  @("$me\AppData\Local\Microsoft\Teams", 'Teams cache'),
  @("$me\.gradle", 'Gradle cache'),
  @("$me\.m2", 'Maven repo'),
  @("$me\.nuget", 'NuGet cache'),
  @("$me\.cargo", 'Rust cache'),
  @("$me\.conda", 'conda envs'),
  @("$me\anaconda3", 'Anaconda'),
  @("$me\miniconda3", 'Miniconda'),
  @("$me\scoop", 'scoop packages'),
  @("$me\Downloads", 'downloads'),
  @("$me\Desktop", 'desktop'),
  @("$me\Documents", 'documents'),
  @("$me\Documents\WeChat Files", 'WeChat files (often huge)'),
  @("$me\Documents\Tencent Files", 'QQ files'),
  @("$me\AppData\Roaming\Tencent", 'Tencent cache'),
  @("$me\AppData\Roaming\DingTalk", 'DingTalk cache'),
  @('C:\Program Files (x86)\Steam\steamapps', 'Steam games'),
  @('C:\ProgramData\NVIDIA Corporation\Downloader', 'NVIDIA driver download cache'),
  @('C:\ProgramData\NVIDIA Corporation\NV_Cache', 'NVIDIA shader cache'),
  @('C:\ProgramData\Adobe\ARM', 'Adobe update cache')
)
foreach ($t in $targets) {
  $p = $t[0]
  $n = $t[1]
  if (Test-Path -LiteralPath $p) {
    $i = Get-Item -LiteralPath $p -Force -ErrorAction SilentlyContinue
    if ($i -and $i.PSIsContainer) { $b = SZ $p } elseif ($i) { $b = $i.Length } else { $b = $null }
    $lw = '-'
    if ($i) { $lw = $i.LastWriteTime.ToString('yyyy-MM-dd') }
    L ('{0,14} | {1} | YES | {2} | {3}' -f (FMT $b), $lw, $p, $n)
  } else {
    L ('{0,14} | {1} | NO  | {2} | {3}' -f '-', '-', $p, $n)
  }
}
L ""

# ---------- 6 ----------
L "## 6. AppData\Local children Top 20"
Get-ChildItem "$me\AppData\Local" -Force -Directory -ErrorAction SilentlyContinue | ForEach-Object {
  $b = SZ $_.FullName
  [pscustomobject]@{ Name = $_.Name; MB = [math]::Round($b/1MB,1); LW = $_.LastWriteTime.ToString('yyyy-MM-dd') }
} | Sort-Object MB -Descending | Select-Object -First 20 | ForEach-Object {
  L ('{0,10:N1} MB | {1} | {2}' -f $_.MB, $_.LW, $_.Name)
}
L ""

# ---------- 7 ----------
L "## 7. AppData\Roaming children Top 15"
Get-ChildItem "$me\AppData\Roaming" -Force -Directory -ErrorAction SilentlyContinue | ForEach-Object {
  $b = SZ $_.FullName
  [pscustomobject]@{ Name = $_.Name; MB = [math]::Round($b/1MB,1); LW = $_.LastWriteTime.ToString('yyyy-MM-dd') }
} | Sort-Object MB -Descending | Select-Object -First 15 | ForEach-Object {
  L ('{0,10:N1} MB | {1} | {2}' -f $_.MB, $_.LW, $_.Name)
}
L ""

# ---------- 8 ----------
L "## 8. ProgramData children Top 15"
Get-ChildItem 'C:\ProgramData' -Force -Directory -ErrorAction SilentlyContinue | ForEach-Object {
  $b = SZ $_.FullName
  [pscustomobject]@{ Name = $_.Name; MB = [math]::Round($b/1MB,1); LW = $_.LastWriteTime.ToString('yyyy-MM-dd') }
} | Sort-Object MB -Descending | Select-Object -First 15 | ForEach-Object {
  L ('{0,10:N1} MB | {1} | {2}' -f $_.MB, $_.LW, $_.Name)
}
L ""

# ---------- 9 ----------
foreach ($root in @('C:\Program Files', 'C:\Program Files (x86)')) {
  if (Test-Path -LiteralPath $root) {
    L "## 9. $root children Top 15"
    Get-ChildItem $root -Force -Directory -ErrorAction SilentlyContinue | ForEach-Object {
      $b = SZ $_.FullName
      [pscustomobject]@{ Name = $_.Name; MB = [math]::Round($b/1MB,1); LW = $_.LastWriteTime.ToString('yyyy-MM-dd') }
    } | Sort-Object MB -Descending | Select-Object -First 15 | ForEach-Object {
      L ('{0,10:N1} MB | {1} | {2}' -f $_.MB, $_.LW, $_.Name)
    }
    L ""
  }
}

# ---------- 10 ----------
L "## 10. Files > 300 MB under user profile (top 40)"
Get-ChildItem $me -Force -Recurse -File -ErrorAction SilentlyContinue | Where-Object { $_.Length -gt 300MB } |
  Sort-Object Length -Descending | Select-Object -First 40 | ForEach-Object {
    L ('{0,10:N0} MB | {1} | {2}' -f ($_.Length/1MB), $_.LastWriteTime.ToString('yyyy-MM-dd'), $_.FullName)
  }
L ""

# ---------- 11 ----------
L "## 11. Downloads top 30 by size"
Get-ChildItem "$me\Downloads" -Force -Recurse -File -ErrorAction SilentlyContinue |
  Sort-Object Length -Descending | Select-Object -First 30 | ForEach-Object {
    L ('{0,10:N0} MB | {1} | {2}' -f ($_.Length/1MB), $_.LastWriteTime.ToString('yyyy-MM-dd'), $_.FullName)
  }
L ""

# ---------- 12 ----------
L "## 12. Large virtual disks / images (.vhdx .vhd .iso .wim .edb > 200MB)"
foreach ($root in @($me, 'C:\ProgramData', 'C:\Program Files', 'C:\Program Files (x86)')) {
  Get-ChildItem $root -Force -Recurse -File -Include '*.vhdx','*.vhd','*.iso','*.wim','*.edb' -ErrorAction SilentlyContinue |
    Where-Object { $_.Length -gt 200MB } | ForEach-Object {
      L ('{0,10:N0} MB | {1} | {2}' -f ($_.Length/1MB), $_.LastWriteTime.ToString('yyyy-MM-dd'), $_.FullName)
    }
}
L ""

# ---------- 13 ----------
L "## 13. Installed programs Top 50 (registry EstimatedSize, approx)"
$keys = @(
  'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\*',
  'HKLM:\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\*',
  'HKCU:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\*'
)
Get-ItemProperty $keys -ErrorAction SilentlyContinue | Where-Object { $_.DisplayName } | ForEach-Object {
  $mb = 0
  if ($_.EstimatedSize) { $mb = [math]::Round($_.EstimatedSize/1024,0) }
  [pscustomobject]@{ MB = $mb; Name = $_.DisplayName; Date = $_.InstallDate; Loc = $_.InstallLocation }
} | Sort-Object MB -Descending | Select-Object -First 50 | ForEach-Object {
  L ('{0,8} MB | {1} | {2} | {3}' -f $_.MB, $_.Date, $_.Name, $_.Loc)
}
L ""

# ---------- 14 ----------
L "## 14. DISM component store analysis (read-only, may need admin)"
$dism = & dism.exe /Online /Cleanup-Image /AnalyzeComponentStore 2>&1
foreach ($line in $dism) { L ([string]$line) }
L ""

L ("## DONE {0}" -f (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'))
