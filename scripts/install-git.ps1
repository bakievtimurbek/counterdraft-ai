$ErrorActionPreference = 'Stop'
$url = 'https://github.com/git-for-windows/git/releases/download/v2.47.0.windows.1/MinGit-2.47.0-64-bit.zip'
$zip = Join-Path $env:TEMP 'mingit.zip'
$dest = 'C:\Users\faruh\AppData\Local\Programs\Git'

Write-Host "Creating destination folder: $dest"
New-Item -ItemType Directory -Force -Path $dest | Out-Null

Write-Host "Downloading MinGit..."
Invoke-WebRequest -Uri $url -OutFile $zip -UseBasicParsing

Write-Host "Extracting MinGit to $dest..."
Expand-Archive -Path $zip -DestinationPath $dest -Force

Remove-Item -Force $zip

Write-Host "Verifying git installation..."
& "$dest\cmd\git.exe" --version

# Add Git to WindowsApps wrappers or User PATH
$gitExe = "$dest\cmd\git.exe"
[IO.File]::WriteAllText('C:\Users\faruh\AppData\Local\Microsoft\WindowsApps\git.cmd', "@call `"$gitExe`" %*")

Write-Host "MinGit setup completed successfully!"
