$OutputEncoding = [Console]::OutputEncoding = [Text.UTF8Encoding]::UTF8
Write-Host "PowerShell script has started"
while($true) {
    $process = Get-Process java -ErrorAction SilentlyContinue | Where-Object {$_.Path -eq "C:\Program Files\Eclipse Adoptium\jre-17.0.9.9-hotspot\bin\java.exe"}
    if($process) {
        Write-Host "Java application detected"
        # Send HTTP request to Discord bot
        $body = @{content='Server is up'} | ConvertTo-Json
        Invoke-WebRequest -Uri "https://discord.com/api/webhooks/1187011815931117639/N5WdNE9RhgtDrkX3papfSvPZ6g-29hgGZymiQQkkyTVF48rALEWAdstvNfo0Erl21uRU" -Method POST -Body $body -ContentType "application/json"
        Write-Host "Signal sent to Discord bot"
    } else {
        Write-Host "Java application not detected"
    }
    Start-Sleep -Seconds 300
}
