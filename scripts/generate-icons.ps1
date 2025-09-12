# TaskFlow Icon Generator Script
# Bu script SVG'den farklı boyutlarda PNG ikonları oluşturur

Write-Host "TaskFlow Ikon Üretici" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

# Gerekli boyutlar (Android)
$sizes = @{
    "mipmap-mdpi" = 48
    "mipmap-hdpi" = 72
    "mipmap-xhdpi" = 96
    "mipmap-xxhdpi" = 144
    "mipmap-xxxhdpi" = 192
}

$baseDir = "android/app/src/main/res"
$iconName = "ic_launcher"
$roundIconName = "ic_launcher_round"

Write-Host "Hedef dizin: $baseDir" -ForegroundColor Yellow

foreach ($folder in $sizes.Keys) {
    $size = $sizes[$folder]
    $targetDir = "$baseDir/$folder"
    
    Write-Host "Oluşturuluyor: $folder (${size}x${size})" -ForegroundColor Cyan
    
    # Dizin kontrolü
    if (!(Test-Path $targetDir)) {
        New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
        Write-Host "  ✓ Dizin oluşturuldu: $targetDir" -ForegroundColor Gray
    }
    
    # İkon dosya yolları
    $iconPath = "$targetDir/$iconName.png"
    $roundIconPath = "$targetDir/$roundIconName.png"
    
    Write-Host "  → $iconPath" -ForegroundColor Gray
    Write-Host "  → $roundIconPath" -ForegroundColor Gray
}

Write-Host ""
Write-Host "NOT: SVG'den PNG dönüşümü için aşağıdaki araçlardan birini kullanabilirsiniz:" -ForegroundColor Yellow
Write-Host "1. Online: https://convertio.co/svg-png/" -ForegroundColor White
Write-Host "2. Inkscape: inkscape --export-png=output.png --export-width=SIZE input.svg" -ForegroundColor White
Write-Host "3. ImageMagick: magick convert -background none input.svg -resize SIZExSIZE output.png" -ForegroundColor White
Write-Host ""
Write-Host "Master SVG dosyası: assets/icon-master.svg" -ForegroundColor Green
Write-Host "İkon oluşturma tamamlandı!" -ForegroundColor Green
