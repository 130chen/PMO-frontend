import zipfile, os, re

s = open('make_report.py', encoding='utf-8').read()

old_block = '''T = lambda txt, **kw: paragraph([run(txt, **kw)], raw=True)

body.append(T('研发项目管理平台（PMO Dashboard）', bold=True, color='1F3864', size=44), align='center', spacing_before=200, spacing_after=80)
body.append(T('近期开发进展汇报', bold=True, color='2E5C9E', size=32), align='center', spacing_after=240)
body.append(T('汇报单位：研发项目管理（PMO）小组', size=22), align='center', spacing_after=40)
body.append(T('汇报日期：2026 年 9 月', size=22), align='center', spacing_after=300)'''

new_block = '''def title_run(txt, **kw):
    return paragraph([run(txt, **kw)], raw=True, align='center')

body.append(title_run('研发项目管理平台（PMO Dashboard）', bold=True, color='1F3864', size=44), spacing_before=200, spacing_after=80)
body.append(title_run('近期开发进展汇报', bold=True, color='2E5C9E', size=32), spacing_after=240)
body.append(title_run('汇报单位：研发项目管理（PMO）小组', size=22), spacing_after=40)
body.append(title_run('汇报日期：2026 年 9 月', size=22), spacing_after=300)'''

assert old_block in s, 'block not found'
s = s.replace(old_block, new_block)
open('make_report.py', 'w', encoding='utf-8').write(s)
print('patched')
