#!/usr/bin/python3
"""Servier PPTX 單張投影片 → 去掉文字、連接線、母片背景 → 裁到圖形範圍的 SVG
用法：/usr/bin/python3 servier-pptx-to-svg.py <解開的pptx資料夾> <投影片編號> <輸出.svg> [保留文字 0/1] [裁切 x0,y0,x1,y1] [左右留白 pt]
裁切座標是投影片的 pt(72 dpi 像素)；一張投影片有好幾個圖時，用來只取其中一個
左右留白：圖太窄、沒地方放標籤時，在兩側加白邊(圖形本身會裁在原範圍內，不會露出隔壁的圖)"""
import sys,re,os,shutil,subprocess,zipfile,tempfile
from PIL import Image
src,n,out=sys.argv[1],int(sys.argv[2]),sys.argv[3]
keep_text=len(sys.argv)>4 and sys.argv[4]=='1'
crop=[float(v) for v in sys.argv[5].split(',')] if len(sys.argv)>5 and sys.argv[5]!='-' else None
padx=float(sys.argv[6]) if len(sys.argv)>6 else 0
tmp=tempfile.mkdtemp(); d=os.path.join(tmp,'x'); shutil.copytree(src,d)
rels=open(f'{d}/ppt/_rels/presentation.xml.rels').read()
rid=re.search(rf'Id="(rId\d+)"[^>]*Target="slides/slide{n}\.xml"',rels) or re.search(rf'Target="slides/slide{n}\.xml"[^>]*Id="(rId\d+)"',rels)
rid=rid.group(1)
p=open(f'{d}/ppt/presentation.xml').read()
p=re.sub(r'<p:sldIdLst>.*?</p:sldIdLst>',lambda m:'<p:sldIdLst>'+re.search(rf'<p:sldId [^>]*r:id="{rid}"/>',m.group(0)).group(0)+'</p:sldIdLst>',p,flags=re.S)
open(f'{d}/ppt/presentation.xml','w').write(p)
s=open(f'{d}/ppt/slides/slide{n}.xml').read()
if not keep_text:
    s=re.sub(r'<p:sp>(?:(?!<p:sp>).)*?</p:sp>',lambda m:'' if '<a:t>' in m.group(0) else m.group(0),s,flags=re.S)
s=re.sub(r'<p:cxnSp>.*?</p:cxnSp>','',s,flags=re.S)
# 指標線(直線形狀，多半帶箭頭)也是標籤的一部分，一併移除
s=re.sub(r'<p:sp>(?:(?!<p:sp>).)*?</p:sp>',lambda m:'' if re.search(r'prst="(line|straightConnector\d*)"',m.group(0)) else m.group(0),s,flags=re.S)
s=re.sub(r'<p:sld ','<p:sld showMasterSp="0" ',s,count=1)
s=re.sub(r'<p:bg>.*?</p:bg>','',s,flags=re.S)
s=re.sub(r'<p:cSld([^>]*)>',lambda m:f'<p:cSld{m.group(1)}><p:bg><p:bgPr><a:solidFill><a:srgbClr val="FFFFFF"/></a:solidFill><a:effectLst/></p:bgPr></p:bg>',s,count=1)
open(f'{d}/ppt/slides/slide{n}.xml','w').write(s)
pp=os.path.join(tmp,'one.pptx')
with zipfile.ZipFile(pp,'w',zipfile.ZIP_DEFLATED) as z:
    for root,_,fs in os.walk(d):
        for f in fs:
            full=os.path.join(root,f); z.write(full,os.path.relpath(full,d))
subprocess.run(['/Applications/LibreOffice.app/Contents/MacOS/soffice','--headless','--convert-to','pdf','--outdir',tmp,pp],capture_output=True)
pdf=os.path.join(tmp,'one.pdf')
subprocess.run(['pdftoppm','-r','72','-png','-singlefile',pdf,os.path.join(tmp,'r')])
im=Image.open(os.path.join(tmp,'r.png')).convert('L')
bw=im.point(lambda v:255 if v<248 else 0)
if crop:
    from PIL import ImageDraw
    mask=Image.new('L',bw.size,0); ImageDraw.Draw(mask).rectangle(crop,fill=255)
    bw=Image.composite(bw,Image.new('L',bw.size,0),mask)
x0,y0,x1,y1=bw.getbbox(); pad=4
x0,y0=max(0,x0-pad),max(0,y0-pad); x1,y1=min(im.width,x1+pad),min(im.height,y1+pad)
subprocess.run(['pdftocairo','-svg',pdf,os.path.join(tmp,'full.svg')])
sv=open(os.path.join(tmp,'full.svg')).read()
W,H=x1-x0,y1-y0
if padx:
    # 圖形裁在原範圍內，再往左右加白邊
    m=re.search(r'<svg[^>]*>',sv); head,body=sv[:m.end()],sv[m.end():].replace('</svg>','')
    sv=(head+f'<defs><clipPath id="kbcrop"><rect x="{x0}" y="{y0}" width="{W}" height="{H}"/></clipPath></defs>'
        +f'<rect x="{x0-padx}" y="{y0}" width="{W+2*padx}" height="{H}" fill="#fff"/><g clip-path="url(#kbcrop)">'+body+'</g></svg>')
    x0-=padx; W+=2*padx
sv=re.sub(r'<svg([^>]*?)width="[^"]*"\s*height="[^"]*"\s*viewBox="[^"]*"',lambda m:f'<svg{m.group(1)}width="{W}" height="{H}" viewBox="{x0} {y0} {W} {H}"',sv,count=1)
open(out,'w').write(sv)
print('bbox',x0,y0,W,H,'size',os.path.getsize(out))
