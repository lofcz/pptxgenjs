<!-- sourced from [MS-PPTX] v25.0 / 2024-08-20 -->
<!-- heading: Slide Show -->

## Slide Show


The following shows an example of the __laserTraceLst__ (section [2.3.1.17](#Section_a0466c2453384edc920a3d095aa8738a)) and __showEvtLst__ (section [2.3.1.26](#Section_04f39c957a484f98bb211f58fcd65e9d)) extensions:

1. <p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" xmlns:p14="http://schemas.microsoft.com/office/powerpoint/2010/main">
2.    <p:cSld>
3.       <p:spTree>
4. ...
5.          <p:pic>
6.             <p:nvPicPr>
7.                <p:cNvPr id="4" name="video1.wmv">
8.                   <a:hlinkClick r:id="" action="ppaction://media"/>
9.                </p:cNvPr>
10.                <p:cNvPicPr>
11.                   <a:picLocks noChangeAspect="1"/>
12.                </p:cNvPicPr>
13.                <p:nvPr>
14.                   <a:videoFile r:link="rId2"/>
15.                   <p:extLst>
16.                      <p:ext uri="{DAA4B4D4-6D71-4841-9C94-3DE7FCFB9230}">
17.                         <p14:media r:embed="rId1">
18.                            <p14:bmkLst/>
19.                         </p14:media>
20.                      </p:ext>
21.                   </p:extLst>
22.                </p:nvPr>
23.             </p:nvPicPr>
24. ...
25.          </p:pic>
26.          <p:sp>
27.             <p:nvSpPr>
28.                <p:cNvPr id="6" name="Rectangle 5"/>
29.                <p:cNvSpPr/>
30.                <p:nvPr/>
31.             </p:nvSpPr>
32. ...
33.          </p:sp>
34.       </p:spTree>
35.    </p:cSld>
36. ...
37.    <p:extLst>
38.       <p:ext uri="{3A86A75C-4F4B-4683-9AE1-C65F6400EC91}">
39.          <p14:laserTraceLst>
40.             <p14:tracePtLst>
41.                <p14:tracePt t="48796" x="6062662" y="3259137"/>
42.                <p14:tracePt t="49796" x="6438900" y="3179762"/>
43.                <p14:tracePt t="50296" x="0" y="0"/>
44.             </p14:tracePtLst>
45.             <p14:tracePtLst>
46.                <p14:tracePt t="52000" x="1196975" y="2982912"/>
47.                <p14:tracePt t="55000" x="0" y="0"/>
48.             </p14:tracePtLst>
49.          </p14:laserTraceLst>
50.       </p:ext>
51.       <p:ext uri="{E180D4A7-C9FB-4DFB-919C-405C955672EB}">
52.          <p14:showEvtLst>
53.             <p14:triggerEvt type="onClick" time="6950" objId="6"/>
54.             <p14:playEvt time="12722" objId="4"/>
55.             <p14:pauseEvt time="38839" objId="4"/>
56.             <p14:seekEvt time="38839" objId="4" seek="10379"/>
57.             <p14:resumeEvt time="38859" objId="4"/>
58.             <p14:stopEvt time="49628" objId="4"/>
59.          </p14:showEvtLst>
60.       </p:ext>
61.    </p:extLst>
62. </p:sld>

First, the example shows a __p14:laserTraceLst__ (section 2.3.1.17) element with two laser traces. The first __p14:tracePtLst__ element indicates the first laser trace which includes three trace points. The first __p14:tracePt__ element's __t __attribute has a value of 48796; its __x__ attribute has a value of 6062662; and its __y__ attribute has a value of 3259137. Together they indicate that the laser pointer first appears after 48.796 seconds at the location (6062662, 3259137). The second __p14:tracePt__ element's __t__ attribute has a value of 49796; its __x __attribute has a value of "6438900"; and its __y__ attribute has a value of 3179762. Together they indicate that the laser pointer moves to the location (6438900, 3179762) after one additional second. The third __p14:tracePt__ element's __t__ attribute has a value of 50296; its __x__ attribute has a value of zero; and its __y__ value has a value of zero. Together, they indicate that the laser pointer moves to location (0, 0) after an additional 500 milliseconds. At this point, the laser trace ends and the laser pointer disappears. The second __p14:tracePtLst__ element indicates the second laser trace, which includes two trace points. The first __p14:tracePt__ element's __t __attribute has a value of 52000; its __x __attribute has a value of 1196975; and its __y__ attribute has a value of 2982912. Together they indicate that the laser pointer reappears 1.704 seconds later at position (1196975, 2982912). The second __p14:tracePt__ element's __t__ attribute has a value of 55000; its __x __attribute has a value of zero; and its __y__ attribute has a value of zero. Together they indicate that the laser pointer moves to location (0, 0) after an additional 3 seconds. At this point, the laser trace ends and the laser pointer again disappears.

Next, the example shows a __p14:showEvtLst__ (section 2.3.1.26) with six events. The __p14:triggerEvt__ element indicates the first event. Its __type__ attribute has a value of "onClick"; its __time__ attribute has a value of 6950; and its __objId__ attribute has a value of 6. Together they indicate that the shape with the name "Rectangle 5" was clicked at 6.95 seconds. The __p14:playEvt__ element indicates the second event. Its __time__ attribute has a value of 12722 and its __objId__ attribute has a value of 4. Together they indicate that the video with name "video1.wmv" began playing at 12.722 seconds. The __p14:pauseEvt__ element indicates the third event. Its __time __attribute has a value of 38839 and its __objId__ attribute has a value of 4. Together they indicate that the video with name "video1.wmv" was paused at 38.839 seconds. The __p14:seekEvt__ element indicates the fourth event. Its __time __attribute has a value of 38839; its __objId__ attribute has a value of 4; and its __seek__ attribute has a value of 10379. Together they indicate that the video with name "video1.wmv" was seeked to 10.379 seconds from the start of the video at 38.839 seconds. The __p14:resumeEvt__ element indicates the fifth event. Its __time __attribute has a value of 38859 and its __objId__ attribute has a value of 4. Together they indicate that the video with name "video1.wmv" resumed playing at 38.859 seconds. The __p14:stopEvt__ element indicates the sixth event. Its __time __attribute has a value of 49628 and its __objId__ attribute has a value of 4. Together they indicate that the video with name "video1.wmv" stopped playing at 49.628 seconds.
