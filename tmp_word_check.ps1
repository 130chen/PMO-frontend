$ErrorActionPreference = 'Stop'
$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0
try {
  $doc = $word.Documents.Open('D:\vscode\PMO-frontend\研发项目管理平台前端开发进展汇报.docx', $false, $true)
  $out = @()
  $out += ('OPEN_OK')
  $out += ('paragraphs=' + $doc.Paragraphs.Count)
  $out += ('tables=' + $doc.Tables.Count)
  $out += ('words=' + $doc.Words.Count)
  $out += ('para1=[' + $doc.Paragraphs.Item(1).Range.Text.Trim() + ']')
  $out += ('para2=[' + $doc.Paragraphs.Item(2).Range.Text.Trim() + ']')
  $doc.Close($false)
} finally {
  $word.Quit()
  [System.Runtime.InteropServices.Marshal]::ReleaseComObject($word) | Out-Null
}
Set-Content -Path 'D:\vscode\PMO-frontend\tmp_word_check.txt' -Value $out -Encoding UTF8
