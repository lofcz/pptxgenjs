<!-- sourced from [MS-PPTX] v25.0 / 2024-08-20 -->
<!-- heading: Media -->

## Media


The following shows an example of a __media__ (section [2.3.1.18](#Section_3d88e290a4a94db29457b04687c06cf5)) extension: 

1.             <p:pic>
2.                 <p:nvPicPr>
3.                     <p:cNvPr id="4" name="video1.wmv" />
4.                     <p:cNvPicPr>
5.                         <a:picLocks noChangeAspect="1"/>
6.                     </p:cNvPicPr>
7.                     <p:nvPr>
8.                         <a:videoFile r:link="rId1"/>
9.                         <p:extLst>
10.                             <p:ext uri="{DAA4B4D4-6D71-4841-9C94-3DE7FCFB9230}">
11.                                 <p14:media xmlns:p14="http://schemas.microsoft.com/office/powerpoint/2010/main" r:embed="rId2">
12.                                     <p14:trim st="18374.0515" end="29596.7072"/>
13.                                     <p14:fade in="1000"/>
14.                                     <p14:bmkLst>
15.                                         <p14:bmk name="Bookmark 1" time="53703.3597"/>
16.                                     </p14:bmkLst>
17.                                 </p14:media>
18.                             </p:ext>
19.                         </p:extLst>
20.                     </p:nvPr>
21.                 </p:nvPicPr>
22.           </p:pic>

This example shows an embedded media that represents a video. The __r:embed__ attribute of the __p14:media__ element has a value of "rId2" and indicates the relationship identifier to use to find the __Media__ (section 2.3.1.18) part. The __st __attribute of the __p14:trim __element has value of 18374.0515 and the __end __attribute has a value of 29596.7072. Together they indicate that the video has been trimmed, such that the first frame played is 18.3740515 seconds from the start of the video and the last frame played is 29.5967072 seconds from the end of the video. The __in __attribute of the __p14:fade__ element has a value of 1000 and indicates the video will fade in for 1 second of playback. Finally, the __p14:bmk__ element indicates a media bookmark. The __time __attribute has a value of 53703.3597 and indicates the bookmark location is 53.7033597 seconds from the start of the video. The bookmark can be used to easily jump to a particular point in the video or to trigger a separate animation.
