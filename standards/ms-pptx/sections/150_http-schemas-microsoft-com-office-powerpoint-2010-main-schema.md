<!-- sourced from [MS-PPTX] v25.0 / 2024-08-20 -->
<!-- heading: http://schemas.microsoft.com/office/powerpoint/2010/main Schema -->

## http://schemas.microsoft.com/office/powerpoint/2010/main Schema


1. <xsd:schema elementFormDefault="qualified" targetNamespace="http://schemas.microsoft.com/office/powerpoint/2010/main" xmlns="http://schemas.microsoft.com/office/powerpoint/2010/main" xmlns:p14="http://schemas.microsoft.com/office/powerpoint/2010/main" xmlns:p173="http://schemas.microsoft.com/office/powerpoint/2017/3/main" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:s="http://schemas.openxmlformats.org/officeDocument/2006/sharedTypes" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a14="http://schemas.microsoft.com/office/drawing/2010/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
2.   <xsd:import namespace="http://schemas.microsoft.com/office/drawing/2010/main" schemaLocation="dml-mainExt.xsd"/>
3.   <xsd:import namespace="http://schemas.openxmlformats.org/drawingml/2006/main" schemaLocation="dml-main.xsd"/>
4.   <xsd:import namespace="http://schemas.openxmlformats.org/officeDocument/2006/relationships" schemaLocation="shared-relationshipReference.xsd"/>
5.   <xsd:import namespace="http://schemas.openxmlformats.org/officeDocument/2006/sharedTypes" schemaLocation="shared-commonSimpleTypes.xsd"/>
6.   <xsd:import namespace="http://schemas.openxmlformats.org/presentationml/2006/main" schemaLocation="pml.xsd"/>
7.   <xsd:simpleType name="ST_UniversalTimeOffset">
8.     <xsd:restriction base="xsd:string"/>
9.   </xsd:simpleType>
10.   <xsd:simpleType name="ST_TransitionPattern">
11.     <xsd:restriction base="xsd:token">
12.       <xsd:enumeration value="diamond"/>
13.       <xsd:enumeration value="hexagon"/>
14.     </xsd:restriction>
15.   </xsd:simpleType>
16.   <xsd:simpleType name="ST_TransitionCenterDirectionType">
17.     <xsd:restriction base="xsd:token">
18.       <xsd:enumeration value="center"/>
19.     </xsd:restriction>
20.   </xsd:simpleType>
21.   <xsd:simpleType name="ST_TransitionShredPattern">
22.     <xsd:restriction base="xsd:token">
23.       <xsd:enumeration value="strip"/>
24.       <xsd:enumeration value="rectangle"/>
25.     </xsd:restriction>
26.   </xsd:simpleType>
27.   <xsd:simpleType name="ST_TransitionCornerAndCenterDirectionType">
28.     <xsd:union memberTypes="p:ST_TransitionCornerDirectionType ST_TransitionCenterDirectionType"/>
29.   </xsd:simpleType>
30.   <xsd:simpleType name="ST_TransitionLeftRightDirectionType">
31.     <xsd:restriction base="xsd:token">
32.       <xsd:enumeration value="l"/>
33.       <xsd:enumeration value="r"/>
34.     </xsd:restriction>
35.   </xsd:simpleType>
36.   <xsd:complexType name="CT_LeftRightDirectionTransition">
37.     <xsd:attribute name="dir" type="ST_TransitionLeftRightDirectionType"/>
38.   </xsd:complexType>
39.   <xsd:element name="vortex" type="p:CT_SideDirectionTransition"/>
40.   <xsd:element name="switch" type="CT_LeftRightDirectionTransition"/>
41.   <xsd:element name="flip" type="CT_LeftRightDirectionTransition"/>
42.   <xsd:complexType name="CT_RippleTransition">
43.     <xsd:attribute name="dir" type="ST_TransitionCornerAndCenterDirectionType" use="optional" default="center"/>
44.   </xsd:complexType>
45.   <xsd:element name="ripple" type="CT_RippleTransition"/>
46.   <xsd:element name="honeycomb" type="p:CT_Empty"/>
47.   <xsd:complexType name="CT_PrismTransition">
48.     <xsd:attribute name="dir" type="p:ST_TransitionSideDirectionType" use="optional" default="l"/>
49.     <xsd:attribute name="isContent" type="xsd:boolean" use="optional" default="false"/>
50.     <xsd:attribute name="isInverted" type="xsd:boolean" use="optional" default="false"/>
51.   </xsd:complexType>
52.   <xsd:element name="prism" type="CT_PrismTransition"/>
53.   <xsd:element name="doors" type="p:CT_OrientationTransition"/>
54.   <xsd:element name="window" type="p:CT_OrientationTransition"/>
55.   <xsd:element name="ferris" type="CT_LeftRightDirectionTransition"/>
56.   <xsd:element name="gallery" type="CT_LeftRightDirectionTransition"/>
57.   <xsd:element name="conveyor" type="CT_LeftRightDirectionTransition"/>
58.   <xsd:element name="pan" type="p:CT_SideDirectionTransition"/>
59.   <xsd:complexType name="CT_GlitterTransition">
60.     <xsd:attribute name="dir" type="p:ST_TransitionSideDirectionType" use="optional" default="l"/>
61.     <xsd:attribute name="pattern" type="ST_TransitionPattern" use="optional" default="diamond"/>
62.   </xsd:complexType>
63.   <xsd:element name="glitter" type="CT_GlitterTransition"/>
64.   <xsd:complexType name="CT_FlyThroughTransition">
65.     <xsd:attribute name="dir" type="p:ST_TransitionInOutDirectionType" use="optional" default="in"/>
66.     <xsd:attribute name="hasBounce" type="xsd:boolean" use="optional" default="false"/>
67.   </xsd:complexType>
68.   <xsd:element name="warp" type="p:CT_InOutTransition"/>
69.   <xsd:element name="flythrough" type="CT_FlyThroughTransition"/>
70.   <xsd:element name="flash" type="p:CT_Empty"/>
71.   <xsd:complexType name="CT_ShredTransition">
72.     <xsd:attribute name="pattern" type="ST_TransitionShredPattern" use="optional" default="strip"/>
73.     <xsd:attribute name="dir" type="p:ST_TransitionInOutDirectionType" use="optional" default="in"/>
74.   </xsd:complexType>
75.   <xsd:element name="shred" type="CT_ShredTransition"/>
76.   <xsd:complexType name="CT_RevealTransition">
77.     <xsd:attribute name="thruBlk" type="xsd:boolean" use="optional" default="false"/>
78.     <xsd:attribute name="dir" type="ST_TransitionLeftRightDirectionType" use="optional" default="l"/>
79.   </xsd:complexType>
80.   <xsd:element name="reveal" type="CT_RevealTransition"/>
81.   <xsd:complexType name="CT_MediaBookmarkTarget">
82.     <xsd:attribute name="spid" type="a:ST_DrawingElementId" use="required"/>
83.     <xsd:attribute name="bmkName" type="xsd:string" use="required"/>
84.   </xsd:complexType>
85.   <xsd:element name="wheelReverse" type="p:CT_WheelTransition"/>
86.   <xsd:attribute name="dur" type="p14:ST_UniversalTimeOffset"/>
87.   <xsd:element name="bmkTgt" type="CT_MediaBookmarkTarget"/>
88.   <xsd:attribute name="presetBounceEnd" type="s:ST_PositiveFixedPercentage"/>
89.   <xsd:attribute name="bounceEnd" type="s:ST_PositiveFixedPercentage"/>
90.   <xsd:complexType name="CT_ContentPartNonVisual">
91.     <xsd:sequence>
92.       <xsd:element name="cNvPr" type="a:CT_NonVisualDrawingProps" minOccurs="1" maxOccurs="1"/>
93.       <xsd:element name="cNvContentPartPr" type="a14:CT_NonVisualInkContentPartProperties" minOccurs="0" maxOccurs="1"/>
94.       <xsd:element name="nvPr" type="p:CT_ApplicationNonVisualDrawingProps" minOccurs="1" maxOccurs="1"/>
95.     </xsd:sequence>
96.   </xsd:complexType>
97.   <xsd:element name="nvContentPartPr" type="CT_ContentPartNonVisual"/>
98.   <xsd:attribute name="bwMode" type="a:ST_BlackWhiteMode"/>
99.   <xsd:element name="xfrm" type="a:CT_Transform2D"/>
100.   <xsd:element name="extLst" type="p:CT_ExtensionListModify"/>
101.   <xsd:complexType name="CT_MediaTrim">
102.     <xsd:attribute name="st" type="p14:ST_UniversalTimeOffset" use="optional" default="0"/>
103.     <xsd:attribute name="end" type="p14:ST_UniversalTimeOffset" use="optional" default="0"/>
104.   </xsd:complexType>
105.   <xsd:complexType name="CT_MediaFade">
106.     <xsd:attribute name="in" type="p14:ST_UniversalTimeOffset" use="optional" default="0"/>
107.     <xsd:attribute name="out" type="p14:ST_UniversalTimeOffset" use="optional" default="0"/>
108.   </xsd:complexType>
109.   <xsd:complexType name="CT_MediaBookmark">
110.     <xsd:attribute name="name" type="xsd:string"/>
111.     <xsd:attribute name="time" type="p14:ST_UniversalTimeOffset"/>
112.   </xsd:complexType>
113.   <xsd:complexType name="CT_MediaBookmarkList">
114.     <xsd:sequence>
115.       <xsd:element name="bmk" type="CT_MediaBookmark" minOccurs="0" maxOccurs="unbounded"/>
116.     </xsd:sequence>
117.   </xsd:complexType>
118.   <xsd:complexType name="CT_Media">
119.     <xsd:sequence>
120.       <xsd:element name="trim" type="CT_MediaTrim" minOccurs="0" maxOccurs="1"/>
121.       <xsd:element name="fade" type="CT_MediaFade" minOccurs="0" maxOccurs="1"/>
122.       <xsd:element name="bmkLst" type="CT_MediaBookmarkList" minOccurs="0" maxOccurs="1"/>
123.       <xsd:element name="extLst" type="p:CT_ExtensionList" minOccurs="0" maxOccurs="1"/>
124.     </xsd:sequence>
125.     <xsd:attributeGroup ref="a:AG_Blob"/>
126.   </xsd:complexType>
127.   <xsd:element name="media" type="CT_Media"/>
128.   <xsd:complexType name="CT_SectionSlideIdListEntry">
129.     <xsd:attribute name="id" type="p:ST_SlideId" use="required"/>
130.   </xsd:complexType>
131.   <xsd:complexType name="CT_SectionSlideIdList">
132.     <xsd:sequence>
133.       <xsd:element name="sldId" type="CT_SectionSlideIdListEntry" minOccurs="0" maxOccurs="unbounded"/>
134.     </xsd:sequence>
135.   </xsd:complexType>
136.   <xsd:complexType name="CT_Section">
137.     <xsd:sequence>
138.       <xsd:element name="sldIdLst" type="CT_SectionSlideIdList" minOccurs="1" maxOccurs="1"/>
139.       <xsd:element name="extLst" type="p:CT_ExtensionList" minOccurs="0" maxOccurs="1"/>
140.     </xsd:sequence>
141.     <xsd:attribute name="name" type="xsd:string"/>
142.     <xsd:attribute name="id" type="s:ST_Guid"/>
143.   </xsd:complexType>
144.   <xsd:complexType name="CT_SectionList">
145.     <xsd:sequence>
146.       <xsd:element name="section" type="CT_Section" minOccurs="1" maxOccurs="unbounded"/>
147.     </xsd:sequence>
148.   </xsd:complexType>
149.   <xsd:element name="sectionLst" type="CT_SectionList"/>
150.   <xsd:complexType name="CT_BrowseMode">
151.     <xsd:attribute name="showStatus" type="xsd:boolean" use="optional" default="true"/>
152.   </xsd:complexType>
153.   <xsd:element name="browseMode" type="CT_BrowseMode"/>
154.   <xsd:element name="laserClr" type="a:CT_Color"/>
155.   <xsd:complexType name="CT_DefaultImageDpi">
156.     <xsd:attribute name="val" type="xsd:unsignedInt" use="required"/>
157.   </xsd:complexType>
158.   <xsd:element name="defaultImageDpi" type="CT_DefaultImageDpi"/>
159.   <xsd:complexType name="CT_DiscardImageEditData">
160.     <xsd:attribute name="val" type="xsd:boolean" use="required"/>
161.   </xsd:complexType>
162.   <xsd:element name="discardImageEditData" type="CT_DiscardImageEditData"/>
163.   <xsd:complexType name="CT_ShowMediaControls">
164.     <xsd:attribute name="val" type="xsd:boolean" use="required"/>
165.   </xsd:complexType>
166.   <xsd:element name="showMediaCtrls" type="CT_ShowMediaControls"/>
167.   <xsd:complexType name="CT_LaserTracePoint">
168.     <xsd:attribute name="t" type="p14:ST_UniversalTimeOffset" use="required"/>
169.     <xsd:attribute name="x" type="a:ST_Coordinate" use="required"/>
170.     <xsd:attribute name="y" type="a:ST_Coordinate" use="required"/>
171.   </xsd:complexType>
172.   <xsd:complexType name="CT_LaserTrace">
173.     <xsd:sequence>
174.       <xsd:element name="tracePt" type="CT_LaserTracePoint" minOccurs="0" maxOccurs="unbounded"/>
175.     </xsd:sequence>
176.   </xsd:complexType>
177.   <xsd:complexType name="CT_LaserTraceList">
178.     <xsd:sequence>
179.       <xsd:element name="tracePtLst" type="CT_LaserTrace" minOccurs="0" maxOccurs="unbounded"/>
180.     </xsd:sequence>
181.   </xsd:complexType>
182.   <xsd:element name="laserTraceLst" type="CT_LaserTraceList"/>
183.   <xsd:complexType name="CT_RandomId">
184.     <xsd:attribute name="val" type="xsd:unsignedInt" use="required"/>
185.   </xsd:complexType>
186.   <xsd:element name="creationId" type="CT_RandomId"/>
187.   <xsd:element name="modId" type="CT_RandomId"/>
188.   <xsd:complexType name="CT_TriggerEventRecord">
189.     <xsd:attribute name="type" type="p:ST_TLTriggerEvent" use="required"/>
190.     <xsd:attribute name="time" type="p14:ST_UniversalTimeOffset" use="required"/>
191.     <xsd:attribute name="objId" type="a:ST_DrawingElementId" use="required"/>
192.   </xsd:complexType>
193.   <xsd:complexType name="CT_NullEventRecord">
194.     <xsd:attribute name="time" type="p14:ST_UniversalTimeOffset" use="required"/>
195.     <xsd:attribute name="objId" type="a:ST_DrawingElementId" use="required"/>
196.   </xsd:complexType>
197.   <xsd:complexType name="CT_MediaPlaybackEventRecord">
198.     <xsd:attribute name="time" type="p14:ST_UniversalTimeOffset" use="required"/>
199.     <xsd:attribute name="objId" type="a:ST_DrawingElementId" use="required"/>
200.   </xsd:complexType>
201.   <xsd:complexType name="CT_MediaSeekEventRecord">
202.     <xsd:attribute name="time" type="p14:ST_UniversalTimeOffset" use="required"/>
203.     <xsd:attribute name="objId" type="a:ST_DrawingElementId" use="required"/>
204.     <xsd:attribute name="seek" type="p14:ST_UniversalTimeOffset" use="required"/>
205.   </xsd:complexType>
206.   <xsd:complexType name="CT_ShowEventRecordList">
207.     <xsd:sequence>
208.       <xsd:choice minOccurs="0" maxOccurs="unbounded">
209.         <xsd:element name="triggerEvt" type="CT_TriggerEventRecord"/>
210.         <xsd:element name="playEvt" type="CT_MediaPlaybackEventRecord"/>
211.         <xsd:element name="stopEvt" type="CT_MediaPlaybackEventRecord"/>
212.         <xsd:element name="pauseEvt" type="CT_MediaPlaybackEventRecord"/>
213.         <xsd:element name="resumeEvt" type="CT_MediaPlaybackEventRecord"/>
214.         <xsd:element name="seekEvt" type="CT_MediaSeekEventRecord"/>
215.         <xsd:element name="nullEvt" type="CT_NullEventRecord"/>
216.       </xsd:choice>
217.     </xsd:sequence>
218.   </xsd:complexType>
219.   <xsd:element name="showEvtLst" type="CT_ShowEventRecordList"/>
220. </xsd:schema>
