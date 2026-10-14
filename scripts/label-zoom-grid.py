"""zoom.py <svg> <x0> <y0> <x1> <y1> <out.png> [W=1600]：放大圖片的一塊區域(百分比)，畫 1% 格線(每 5% 加粗並標數字)"""
import sys,subprocess,os
f,x0,y0,x1,y1,out=sys.argv[1],*map(float,sys.argv[2:6]),sys.argv[6]
W=int(sys.argv[7]) if len(sys.argv)>7 else 1400
import re
t=open(f).read(); m=re.search(r'viewBox="([\d.\- ]+)"',t); vb=list(map(float,m.group(1).split()))
ar=vb[3]/vb[2]
fullW=W/((x1-x0)/100); fullH=fullW*ar
H=int(fullH*(y1-y0)/100)
lines=''
for p in range(int(x0),int(x1)+1):
    X=(p/100*fullW)-(x0/100*fullW); b=p%5==0
    lines+=f'<div style="position:absolute;left:{X}px;top:0;height:{H}px;border-left:1px solid rgba(255,0,0,{0.7 if b else 0.25})"></div>'
    if b: lines+=f'<span style="position:absolute;left:{X+2}px;top:2px;font:bold 12px sans-serif;color:red;background:#fff8">{p}</span>'
for p in range(int(y0),int(y1)+1):
    Y=(p/100*fullH)-(y0/100*fullH); b=p%5==0
    lines+=f'<div style="position:absolute;top:{Y}px;left:0;width:{W}px;border-top:1px solid rgba(0,0,255,{0.7 if b else 0.25})"></div>'
    if b: lines+=f'<span style="position:absolute;top:{Y+2}px;left:2px;font:bold 12px sans-serif;color:blue;background:#fff8">{p}</span>'
html=f'<body style="margin:0"><div style="position:relative;width:{W}px;height:{H}px;overflow:hidden"><img src="file://{os.path.abspath(f)}" style="position:absolute;left:{-x0/100*fullW}px;top:{-y0/100*fullH}px;width:{fullW}px;height:{fullH}px">{lines}</div>'
open('/tmp/_z.html','w').write(html)
subprocess.run(['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome','--headless','--disable-gpu','--hide-scrollbars','--allow-file-access-from-files',f'--window-size={W},{H}',f'--screenshot={out}','file:///tmp/_z.html'],capture_output=True)
