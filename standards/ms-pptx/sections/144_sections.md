<!-- sourced from [MS-PPTX] v25.0 / 2024-08-20 -->
<!-- heading: Sections -->

## Sections


The following shows an example of a __sectionLst__ (section [2.3.1.25](#Section_db88eca9e5d04fc6b1c95387557998bd)) extension:

1. <p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" xmlns:p14="http://schemas.microsoft.com/office/powerpoint/2010/main" saveSubsetFonts="1">  
  
...  

2.    <p:sldIdLst>
3.       <p:sldId id="256" r:id="rId2"/>
4.       <p:sldId id="257" r:id="rId3"/>
5.       <p:sldId id="259" r:id="rId4"/>
6.       <p:sldId id="258" r:id="rId5"/>
7.    </p:sldIdLst>  

8. ...  

9.   <p:extLst>
10.      <p:ext uri="{521415D9-36F7-43E2-AB2F-B90AF26B5E84}">
11.          <p14:sectionLst>
12.              <p14:section name="Introduction" id="{01F07B81-39E6-4BBB-9B89-66EA253FBD29}">
13.                  <p14:sldIdLst>
14.                      <p14:sldId id="256"/>
15.                  </p14:sldIdLst>
16.              </p14:section>
17.              <p14:section name="Content" id="{1FEF2C88-0CF2-4176-BA81-0DE6FD9D1274}">
18.                  <p14:sldIdLst>
19.                      <p14:sldId id="257"/>
20.                      <p14:sldId id="259"/>
21.                  </p14:sldIdLst>
22.              </p14:section>
23.              <p14:section name="Conclusion" id="{CA1E145A-94F4-4C2D-9BC0-76C4A01D48ED}">
24.                  <p14:sldIdLst>
25.                      <p14:sldId id="258"/>
26.                  </p14:sldIdLst>
27.              </p14:section>
28.          </p14:sectionLst>
29.      </p:ext>
30.    </p:extLst>
31. </p:presentation>

This example shows a presentation with three sections. The first __p14:section__ element represents the first section. Its __name__ attribute has a value of "Introduction" and indicates the name of the first section; its child element __p14:sldIdLst__ has a child __p14:sldId__ with the value of 256 that indicates that the first section encompasses the first [__presentation slide__](#gt_18428521-9032-41a4-85c4-6fb65d882192). The second __p14:section__ element represents the second section. Its __name__ attribute has a value of "Content" and indicates the name of the second section; it has a child element __p14:sldIdLst__ that has two __p14:sldId__ child elements with the values of 257 and 259 and that indicates that the second section encompasses the second and third presentation slides. The third __p14:section__ element represents the third section. Its __name__ attribute has a value of "Conclusion" and indicates the name of the third section; its child element __p14__:__sldIdLst__ has only one child element __p14:sldId__ with the value of 258 and that indicates that the third section encompasses the fourth presentation slide.
