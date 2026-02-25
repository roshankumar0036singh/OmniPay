$files = git status -s | ForEach-Object { $_.Substring(3) }
$count = 1

foreach ($file in $files) {
    if ([string]::IsNullOrWhiteSpace($file)) { continue }
    
    $prefix = "chore"
    $action = "update logic in"
    
    if ($file -match "components") { 
        $prefix = "ui"
        $action = "refine visual aesthetics of"
    } elseif ($file -match "routes") { 
        $prefix = "api" 
        $action = "enhance endpoint handling for"
    } elseif ($file -match "services") { 
        $prefix = "feat" 
        $action = "implement core business logic in"
    } elseif ($file -match "scrapers") { 
        $prefix = "scrape" 
        $action = "update data extraction logic in"
    } elseif ($file -match "locales") {
        $prefix = "i18n"
        $action = "add language translations for"
    }
    
    if ($count -lt 30) {
        git add $file
        git commit -m "$($prefix): $action $(Split-Path $file -Leaf)"
        $count++
    } else {
        git add $file
    }
}

if ($count -ge 30) {
    git commit -m "chore: finalize remaining system integrations and configurations"
}

git push
