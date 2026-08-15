<!-- sourced from [MS-PPTX] v25.0 / 2024-08-20 -->
<!-- heading: http://schemas.microsoft.com/office/powerpoint/2013/main/command Schema -->

## http://schemas.microsoft.com/office/powerpoint/2013/main/command Schema


1. <xsd:schema elementFormDefault="qualified" targetNamespace="http://schemas.microsoft.com/office/powerpoint/2013/main/command" xmlns="http://schemas.microsoft.com/office/powerpoint/2013/main/command" xmlns:pc="http://schemas.microsoft.com/office/powerpoint/2013/main/command" xmlns:pc226="http://schemas.microsoft.com/office/powerpoint/2022/06/main/command" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" xmlns:p14="http://schemas.microsoft.com/office/powerpoint/2010/main" xmlns:p15="http://schemas.microsoft.com/office/powerpoint/2012/main" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:ac="http://schemas.microsoft.com/office/drawing/2013/main/command" xmlns:s="http://schemas.openxmlformats.org/officeDocument/2006/sharedTypes" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
2.   <xsd:import namespace="http://schemas.microsoft.com/office/drawing/2013/main/command" schemaLocation="dml-cmd.xsd"/>
3.   <xsd:import namespace="http://schemas.microsoft.com/office/powerpoint/2022/06/main/command" schemaLocation="ms-pptxCmd226.xsd"/>
4.   <xsd:import namespace="http://schemas.openxmlformats.org/officeDocument/2006/sharedTypes" schemaLocation="shared-commonSimpleTypes.xsd"/>
5.   <xsd:import namespace="http://schemas.openxmlformats.org/presentationml/2006/main" schemaLocation="pml.xsd"/>
6.   <xsd:simpleType name="ST_CreationId">
7.     <xsd:restriction base="xsd:unsignedInt"/>
8.   </xsd:simpleType>
9.   <xsd:complexType name="CT_DocumentMoniker"/>
10.   <xsd:complexType name="CT_SlideMoniker">
11.     <xsd:attribute name="cId" type="ST_CreationId" use="optional"/>
12.     <xsd:attribute name="sldId" type="p:ST_SlideId" use="required"/>
13.   </xsd:complexType>
14.   <xsd:complexType name="CT_MainMasterMoniker">
15.     <xsd:attribute name="cId" type="ST_CreationId" use="optional"/>
16.     <xsd:attribute name="sldId" type="p:ST_SlideMasterId" use="required"/>
17.   </xsd:complexType>
18.   <xsd:complexType name="CT_SlideLayoutMoniker">
19.     <xsd:attribute name="cId" type="ST_CreationId" use="optional"/>
20.     <xsd:attribute name="sldId" type="p:ST_SlideLayoutId" use="required"/>
21.   </xsd:complexType>
22.   <xsd:complexType name="CT_CommentMoniker">
23.     <xsd:attribute name="authorId" type="xsd:unsignedInt" use="required"/>
24.     <xsd:attribute name="idx" type="p:ST_Index" use="required"/>
25.   </xsd:complexType>
26.   <xsd:complexType name="CT_CommentAuthorMoniker">
27.     <xsd:attribute name="id" type="xsd:unsignedInt" use="required"/>
28.   </xsd:complexType>
29.   <xsd:complexType name="CT_DocumentMonikerList">
30.     <xsd:sequence>
31.       <xsd:any minOccurs="0" maxOccurs="unbounded"/>
32.     </xsd:sequence>
33.   </xsd:complexType>
34.   <xsd:complexType name="CT_SlideBaseMonikerList">
35.     <xsd:sequence>
36.       <xsd:any minOccurs="0" maxOccurs="unbounded"/>
37.     </xsd:sequence>
38.   </xsd:complexType>
39.   <xsd:complexType name="CT_MainMasterMonikerList">
40.     <xsd:sequence>
41.       <xsd:any minOccurs="0" maxOccurs="unbounded"/>
42.     </xsd:sequence>
43.   </xsd:complexType>
44.   <xsd:complexType name="CT_SlideLayoutMonikerList">
45.     <xsd:sequence>
46.       <xsd:any minOccurs="0" maxOccurs="unbounded"/>
47.     </xsd:sequence>
48.   </xsd:complexType>
49.   <xsd:complexType name="CT_SlideMonikerList">
50.     <xsd:sequence>
51.       <xsd:any minOccurs="0" maxOccurs="unbounded"/>
52.     </xsd:sequence>
53.   </xsd:complexType>
54.   <xsd:complexType name="CT_CommentMonikerList">
55.     <xsd:sequence>
56.       <xsd:any minOccurs="0" maxOccurs="unbounded"/>
57.     </xsd:sequence>
58.   </xsd:complexType>
59.   <xsd:complexType name="CT_CommentAuthorMonikerList">
60.     <xsd:sequence>
61.       <xsd:any minOccurs="0" maxOccurs="unbounded"/>
62.     </xsd:sequence>
63.   </xsd:complexType>
64.   <xsd:element name="cmAuthorMkLst" type="CT_CommentAuthorMonikerList"/>
65.   <xsd:element name="cmMkLst" type="CT_CommentMonikerList"/>
66.   <xsd:element name="docMkLst" type="CT_DocumentMonikerList"/>
67.   <xsd:element name="sldBaseMkLst" type="CT_SlideBaseMonikerList"/>
68.   <xsd:element name="sldLayoutMkLst" type="CT_SlideLayoutMonikerList"/>
69.   <xsd:element name="sldMasterMkLst" type="CT_MainMasterMonikerList"/>
70.   <xsd:element name="sldMkLst" type="CT_SlideMonikerList"/>
71.   <xsd:simpleType name="ST_CommentChangeBit">
72.     <xsd:restriction base="xsd:token">
73.       <xsd:enumeration value="add"/>
74.       <xsd:enumeration value="del"/>
75.       <xsd:enumeration value="mod"/>
76.       <xsd:enumeration value="replId"/>
77.     </xsd:restriction>
78.   </xsd:simpleType>
79.   <xsd:simpleType name="ST_CommentChangeBits">
80.     <xsd:list itemType="ST_CommentChangeBit"/>
81.   </xsd:simpleType>
82.   <xsd:complexType name="CT_CommentChanges">
83.     <xsd:sequence>
84.       <xsd:element name="chgData" type="ac:CT_ChangesData" minOccurs="0" maxOccurs="1"/>
85.       <xsd:element name="cmMkLst" type="CT_CommentMonikerList" minOccurs="1" maxOccurs="1"/>
86.       <xsd:element name="extLst" type="p:CT_ExtensionList" minOccurs="0" maxOccurs="1"/>
87.     </xsd:sequence>
88.     <xsd:attribute name="chg" type="ST_CommentChangeBits" use="required"/>
89.   </xsd:complexType>
90.   <xsd:simpleType name="ST_CommentAuthorChangeBit">
91.     <xsd:restriction base="xsd:token">
92.       <xsd:enumeration value="add"/>
93.       <xsd:enumeration value="del"/>
94.       <xsd:enumeration value="mod"/>
95.       <xsd:enumeration value="replId"/>
96.     </xsd:restriction>
97.   </xsd:simpleType>
98.   <xsd:simpleType name="ST_CommentAuthorChangeBits">
99.     <xsd:list itemType="ST_CommentAuthorChangeBit"/>
100.   </xsd:simpleType>
101.   <xsd:complexType name="CT_CommentAuthorChanges">
102.     <xsd:sequence>
103.       <xsd:element name="chgData" type="ac:CT_ChangesData" minOccurs="0" maxOccurs="1"/>
104.       <xsd:element name="cmAuthorMkLst" type="CT_CommentAuthorMonikerList" minOccurs="1" maxOccurs="1"/>
105.       <xsd:element name="extLst" type="p:CT_ExtensionList" minOccurs="0" maxOccurs="1"/>
106.     </xsd:sequence>
107.     <xsd:attribute name="chg" type="ST_CommentAuthorChangeBits" use="required"/>
108.   </xsd:complexType>
109.   <xsd:simpleType name="ST_SlideChangeBit">
110.     <xsd:restriction base="xsd:token">
111.       <xsd:enumeration value="addSp"/>
112.       <xsd:enumeration value="delSp"/>
113.       <xsd:enumeration value="modSp"/>
114.       <xsd:enumeration value="spOrd"/>
115.       <xsd:enumeration value="new"/>
116.       <xsd:enumeration value="add"/>
117.       <xsd:enumeration value="del"/>
118.       <xsd:enumeration value="mod"/>
119.       <xsd:enumeration value="ord"/>
120.       <xsd:enumeration value="replId"/>
121.       <xsd:enumeration value="modTransition"/>
122.       <xsd:enumeration value="modMedia"/>
123.       <xsd:enumeration value="setBg"/>
124.       <xsd:enumeration value="setFolMasterAnim"/>
125.       <xsd:enumeration value="setFolMasterObjs"/>
126.       <xsd:enumeration value="modClrScheme"/>
127.       <xsd:enumeration value="addAnim"/>
128.       <xsd:enumeration value="delAnim"/>
129.       <xsd:enumeration value="modAnim"/>
130.       <xsd:enumeration value="replTag"/>
131.       <xsd:enumeration value="delTag"/>
132.       <xsd:enumeration value="setClrOvrMap"/>
133.       <xsd:enumeration value="delDesignElem"/>
134.       <xsd:enumeration value="modShow"/>
135.       <xsd:enumeration value="addCm"/>
136.       <xsd:enumeration value="delCm"/>
137.       <xsd:enumeration value="modCm"/>
138.       <xsd:enumeration value="chgLayout"/>
139.       <xsd:enumeration value="modNotes"/>
140.       <xsd:enumeration value="modNotesTx"/>
141.       <xsd:enumeration value="setSldSyncInfo"/>
142.       <xsd:enumeration value="newSectionLinks"/>
143.     </xsd:restriction>
144.   </xsd:simpleType>
145.   <xsd:simpleType name="ST_SlideChangeBits">
146.     <xsd:list itemType="ST_SlideChangeBit"/>
147.   </xsd:simpleType>
148.   <xsd:complexType name="CT_SlideChanges">
149.     <xsd:sequence>
150.       <xsd:element name="chgData" type="ac:CT_ChangesData" minOccurs="0" maxOccurs="1"/>
151.       <xsd:element name="sldMkLst" type="CT_SlideMonikerList" minOccurs="1" maxOccurs="1"/>
152.       <xsd:element name="spChg" type="ac:CT_ShapeChanges" minOccurs="0" maxOccurs="unbounded"/>
153.       <xsd:element name="grpChg" type="ac:CT_GroupShapeChanges" minOccurs="0" maxOccurs="unbounded"/>
154.       <xsd:element name="graphicFrameChg" type="ac:CT_GraphicFrameChanges" minOccurs="0" maxOccurs="unbounded"/>
155.       <xsd:element name="picChg" type="ac:CT_PictureChanges" minOccurs="0" maxOccurs="unbounded"/>
156.       <xsd:element name="inkChg" type="ac:CT_InkChanges" minOccurs="0" maxOccurs="unbounded"/>
157.       <xsd:element name="cxnChg" type="ac:CT_ConnectorChanges" minOccurs="0" maxOccurs="unbounded"/>
158.       <xsd:element name="cmChg" type="CT_CommentChanges" minOccurs="0" maxOccurs="unbounded"/>
159.       <xsd:element name="extLst" type="p:CT_ExtensionList" minOccurs="0" maxOccurs="1"/>
160.     </xsd:sequence>
161.     <xsd:attribute name="chg" type="ST_SlideChangeBits" use="required"/>
162.   </xsd:complexType>
163.   <xsd:simpleType name="ST_SlideLayoutChangeBit">
164.     <xsd:restriction base="xsd:token">
165.       <xsd:enumeration value="addSp"/>
166.       <xsd:enumeration value="delSp"/>
167.       <xsd:enumeration value="modSp"/>
168.       <xsd:enumeration value="spOrd"/>
169.       <xsd:enumeration value="new"/>
170.       <xsd:enumeration value="add"/>
171.       <xsd:enumeration value="del"/>
172.       <xsd:enumeration value="mod"/>
173.       <xsd:enumeration value="ord"/>
174.       <xsd:enumeration value="replId"/>
175.       <xsd:enumeration value="modTransition"/>
176.       <xsd:enumeration value="modMedia"/>
177.       <xsd:enumeration value="setBg"/>
178.       <xsd:enumeration value="setFolMasterAnim"/>
179.       <xsd:enumeration value="setFolMasterObjs"/>
180.       <xsd:enumeration value="modClrScheme"/>
181.       <xsd:enumeration value="addAnim"/>
182.       <xsd:enumeration value="delAnim"/>
183.       <xsd:enumeration value="modAnim"/>
184.       <xsd:enumeration value="replTag"/>
185.       <xsd:enumeration value="delTag"/>
186.       <xsd:enumeration value="setClrOvrMap"/>
187.       <xsd:enumeration value="delDesignElem"/>
188.       <xsd:enumeration value="modShow"/>
189.     </xsd:restriction>
190.   </xsd:simpleType>
191.   <xsd:simpleType name="ST_SlideLayoutChangeBits">
192.     <xsd:list itemType="ST_SlideLayoutChangeBit"/>
193.   </xsd:simpleType>
194.   <xsd:complexType name="CT_SlideLayoutChanges">
195.     <xsd:sequence>
196.       <xsd:element name="chgData" type="ac:CT_ChangesData" minOccurs="0" maxOccurs="1"/>
197.       <xsd:element name="sldLayoutMkLst" type="CT_SlideLayoutMonikerList" minOccurs="1" maxOccurs="1"/>
198.       <xsd:element name="spChg" type="ac:CT_ShapeChanges" minOccurs="0" maxOccurs="unbounded"/>
199.       <xsd:element name="grpChg" type="ac:CT_GroupShapeChanges" minOccurs="0" maxOccurs="unbounded"/>
200.       <xsd:element name="graphicFrameChg" type="ac:CT_GraphicFrameChanges" minOccurs="0" maxOccurs="unbounded"/>
201.       <xsd:element name="picChg" type="ac:CT_PictureChanges" minOccurs="0" maxOccurs="unbounded"/>
202.       <xsd:element name="inkChg" type="ac:CT_InkChanges" minOccurs="0" maxOccurs="unbounded"/>
203.       <xsd:element name="cxnChg" type="ac:CT_ConnectorChanges" minOccurs="0" maxOccurs="unbounded"/>
204.       <xsd:element name="extLst" type="p:CT_ExtensionList" minOccurs="0" maxOccurs="1"/>
205.     </xsd:sequence>
206.     <xsd:attribute name="chg" type="ST_SlideLayoutChangeBits" use="required"/>
207.   </xsd:complexType>
208.   <xsd:simpleType name="ST_MainMasterChangeBit">
209.     <xsd:restriction base="xsd:token">
210.       <xsd:enumeration value="addSp"/>
211.       <xsd:enumeration value="delSp"/>
212.       <xsd:enumeration value="modSp"/>
213.       <xsd:enumeration value="spOrd"/>
214.       <xsd:enumeration value="new"/>
215.       <xsd:enumeration value="add"/>
216.       <xsd:enumeration value="del"/>
217.       <xsd:enumeration value="mod"/>
218.       <xsd:enumeration value="ord"/>
219.       <xsd:enumeration value="replId"/>
220.       <xsd:enumeration value="modTransition"/>
221.       <xsd:enumeration value="modMedia"/>
222.       <xsd:enumeration value="setBg"/>
223.       <xsd:enumeration value="setFolMasterAnim"/>
224.       <xsd:enumeration value="setFolMasterObjs"/>
225.       <xsd:enumeration value="modClrScheme"/>
226.       <xsd:enumeration value="addAnim"/>
227.       <xsd:enumeration value="delAnim"/>
228.       <xsd:enumeration value="modAnim"/>
229.       <xsd:enumeration value="replTag"/>
230.       <xsd:enumeration value="delTag"/>
231.       <xsd:enumeration value="setClrOvrMap"/>
232.       <xsd:enumeration value="delDesignElem"/>
233.       <xsd:enumeration value="modShow"/>
234.       <xsd:enumeration value="addSldLayout"/>
235.       <xsd:enumeration value="delSldLayout"/>
236.       <xsd:enumeration value="modSldLayout"/>
237.       <xsd:enumeration value="sldLayoutOrd"/>
238.     </xsd:restriction>
239.   </xsd:simpleType>
240.   <xsd:simpleType name="ST_MainMasterChangeBits">
241.     <xsd:list itemType="ST_MainMasterChangeBit"/>
242.   </xsd:simpleType>
243.   <xsd:complexType name="CT_MainMasterChanges">
244.     <xsd:sequence>
245.       <xsd:element name="chgData" type="ac:CT_ChangesData" minOccurs="0" maxOccurs="1"/>
246.       <xsd:element name="sldMasterMkLst" type="CT_MainMasterMonikerList" minOccurs="1" maxOccurs="1"/>
247.       <xsd:element name="spChg" type="ac:CT_ShapeChanges" minOccurs="0" maxOccurs="unbounded"/>
248.       <xsd:element name="grpChg" type="ac:CT_GroupShapeChanges" minOccurs="0" maxOccurs="unbounded"/>
249.       <xsd:element name="graphicFrameChg" type="ac:CT_GraphicFrameChanges" minOccurs="0" maxOccurs="unbounded"/>
250.       <xsd:element name="picChg" type="ac:CT_PictureChanges" minOccurs="0" maxOccurs="unbounded"/>
251.       <xsd:element name="inkChg" type="ac:CT_InkChanges" minOccurs="0" maxOccurs="unbounded"/>
252.       <xsd:element name="cxnChg" type="ac:CT_ConnectorChanges" minOccurs="0" maxOccurs="unbounded"/>
253.       <xsd:element name="sldLayoutChg" type="CT_SlideLayoutChanges" minOccurs="0" maxOccurs="unbounded"/>
254.       <xsd:element name="extLst" type="p:CT_ExtensionList" minOccurs="0" maxOccurs="1"/>
255.     </xsd:sequence>
256.     <xsd:attribute name="chg" type="ST_MainMasterChangeBits" use="required"/>
257.   </xsd:complexType>
258.   <xsd:simpleType name="ST_DocumentChangeBit">
259.     <xsd:restriction base="xsd:token">
260.       <xsd:enumeration value="undo"/>
261.       <xsd:enumeration value="redo"/>
262.       <xsd:enumeration value="ext"/>
263.       <xsd:enumeration value="custSel"/>
264.       <xsd:enumeration value="mod"/>
265.       <xsd:enumeration value="addSld"/>
266.       <xsd:enumeration value="delSld"/>
267.       <xsd:enumeration value="modSld"/>
268.       <xsd:enumeration value="sldOrd"/>
269.       <xsd:enumeration value="addMainMaster"/>
270.       <xsd:enumeration value="delMainMaster"/>
271.       <xsd:enumeration value="modMainMaster"/>
272.       <xsd:enumeration value="mainMasterOrd"/>
273.       <xsd:enumeration value="addSection"/>
274.       <xsd:enumeration value="delSection"/>
275.       <xsd:enumeration value="modSection"/>
276.       <xsd:enumeration value="addCmAuthor"/>
277.       <xsd:enumeration value="delCmAuthor"/>
278.       <xsd:enumeration value="modCmAuthor"/>
279.       <xsd:enumeration value="replTag"/>
280.       <xsd:enumeration value="delTag"/>
281.       <xsd:enumeration value="addCustShow"/>
282.       <xsd:enumeration value="delCustShow"/>
283.       <xsd:enumeration value="modCustShow"/>
284.       <xsd:enumeration value="modNotesMaster"/>
285.       <xsd:enumeration value="modHandout"/>
286.       <xsd:enumeration value="modShowInfo"/>
287.       <xsd:enumeration value="addOsfTaskPaneApp"/>
288.       <xsd:enumeration value="delOsfTaskPaneApp"/>
289.       <xsd:enumeration value="setSldSz"/>
290.       <xsd:enumeration value="modRtl"/>
291.       <xsd:enumeration value="modChgInfo"/>
292.     </xsd:restriction>
293.   </xsd:simpleType>
294.   <xsd:simpleType name="ST_DocumentChangeBits">
295.     <xsd:list itemType="ST_DocumentChangeBit"/>
296.   </xsd:simpleType>
297.   <xsd:complexType name="CT_DocumentChanges">
298.     <xsd:sequence>
299.       <xsd:element name="chgData" type="ac:CT_ChangesData" minOccurs="0" maxOccurs="1"/>
300.       <xsd:element name="docMkLst" type="CT_DocumentMonikerList" minOccurs="1" maxOccurs="1"/>
301.       <xsd:element name="sldChg" type="CT_SlideChanges" minOccurs="0" maxOccurs="unbounded"/>
302.       <xsd:element name="sldMasterChg" type="CT_MainMasterChanges" minOccurs="0" maxOccurs="unbounded"/>
303.       <xsd:element name="cmAuthorChg" type="CT_CommentAuthorChanges" minOccurs="0" maxOccurs="unbounded"/>
304.       <xsd:element name="extLst" type="p:CT_ExtensionList" minOccurs="0" maxOccurs="1"/>
305.     </xsd:sequence>
306.     <xsd:attribute name="chg" type="ST_DocumentChangeBits" use="required"/>
307.   </xsd:complexType>
308.   <xsd:complexType name="CT_DocumentChangesList">
309.     <xsd:sequence>
310.       <xsd:element name="chgData" type="ac:CT_ChangesData" minOccurs="0" maxOccurs="1"/>
311.       <xsd:element name="docChg" type="CT_DocumentChanges" minOccurs="0" maxOccurs="unbounded"/>
312.       <xsd:element name="extLst" type="p:CT_ExtensionList" minOccurs="0" maxOccurs="1"/>
313.     </xsd:sequence>
314.   </xsd:complexType>
315.   <xsd:complexType name="CT_ChangesInfo">
316.     <xsd:sequence>
317.       <xsd:element name="docChgLst" type="CT_DocumentChangesList" minOccurs="0" maxOccurs="unbounded"/>
318.     </xsd:sequence>
319.   </xsd:complexType>
320.   <xsd:element name="chgInfo" type="CT_ChangesInfo"/>
321. </xsd:schema>
