<!-- sourced from [MS-PPTX] v25.0 / 2024-08-20 -->
<!-- heading: http://schemas.microsoft.com/office/powerpoint/2018/8/main Schema -->

## http://schemas.microsoft.com/office/powerpoint/2018/8/main Schema


1. <xsd:schema elementFormDefault="qualified" targetNamespace="http://schemas.microsoft.com/office/powerpoint/2018/8/main" xmlns="http://schemas.microsoft.com/office/powerpoint/2018/8/main" xmlns:p188="http://schemas.microsoft.com/office/powerpoint/2018/8/main" xmlns:p223="http://schemas.microsoft.com/office/powerpoint/2022/03/main" xmlns:p228="http://schemas.microsoft.com/office/powerpoint/2022/08/main" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:s="http://schemas.openxmlformats.org/officeDocument/2006/sharedTypes" xmlns:pc="http://schemas.microsoft.com/office/powerpoint/2013/main/command" xmlns:ac="http://schemas.microsoft.com/office/drawing/2013/main/command" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
2.   <xsd:import namespace="http://schemas.microsoft.com/office/drawing/2013/main/command" schemaLocation="dml-cmd.xsd"/>
3.   <xsd:import namespace="http://schemas.microsoft.com/office/powerpoint/2022/03/main" schemaLocation="ms-pptxReactions223.xsd"/>
4.   <xsd:import namespace="http://schemas.microsoft.com/office/powerpoint/2022/08/main" schemaLocation="ms-pptxTasks228.xsd"/>
5.   <xsd:import namespace="http://schemas.openxmlformats.org/drawingml/2006/main" schemaLocation="dml-main.xsd"/>
6.   <xsd:import namespace="http://schemas.openxmlformats.org/officeDocument/2006/sharedTypes" schemaLocation="shared-commonSimpleTypes.xsd"/>
7.   <xsd:import namespace="http://schemas.openxmlformats.org/presentationml/2006/main" schemaLocation="pml.xsd"/>
8.   <xsd:simpleType name="ST_AuthorId">
9.     <xsd:restriction base="s:ST_Guid"/>
10.   </xsd:simpleType>
11.   <xsd:complexType name="CT_Author">
12.     <xsd:sequence>
13.       <xsd:element name="extLst" type="p:CT_ExtensionList" minOccurs="0" maxOccurs="1"/>
14.     </xsd:sequence>
15.     <xsd:attribute name="id" type="ST_AuthorId" use="required"/>
16.     <xsd:attribute name="name" type="xsd:string" use="required"/>
17.     <xsd:attribute name="initials" type="xsd:string" use="optional"/>
18.     <xsd:attribute name="userId" type="xsd:string" use="required"/>
19.     <xsd:attribute name="providerId" type="xsd:string" use="required"/>
20.   </xsd:complexType>
21.   <xsd:complexType name="CT_AuthorList">
22.     <xsd:sequence>
23.       <xsd:element name="author" type="CT_Author" minOccurs="0" maxOccurs="unbounded"/>
24.     </xsd:sequence>
25.   </xsd:complexType>
26.   <xsd:simpleType name="ST_AuthorIdList">
27.     <xsd:list itemType="ST_AuthorId"/>
28.   </xsd:simpleType>
29.   <xsd:element name="authorLst" type="CT_AuthorList"/>
30.   <xsd:simpleType name="ST_CommentStatus">
31.     <xsd:restriction base="xsd:token">
32.       <xsd:enumeration value="active"/>
33.       <xsd:enumeration value="resolved"/>
34.       <xsd:enumeration value="closed"/>
35.     </xsd:restriction>
36.   </xsd:simpleType>
37.   <xsd:simpleType name="ST_CommentId">
38.     <xsd:restriction base="s:ST_Guid"/>
39.   </xsd:simpleType>
40.   <xsd:group name="EG_CommentProperties">
41.     <xsd:sequence>
42.       <xsd:element name="txBody" type="a:CT_TextBody" minOccurs="0" maxOccurs="1"/>
43.       <xsd:element name="extLst" type="p:CT_ExtensionList" minOccurs="0" maxOccurs="1"/>
44.     </xsd:sequence>
45.   </xsd:group>
46.   <xsd:attributeGroup name="AG_CommentProperties">
47.     <xsd:attribute name="id" type="ST_CommentId" use="required"/>
48.     <xsd:attribute name="authorId" type="ST_AuthorId" use="required"/>
49.     <xsd:attribute name="status" type="ST_CommentStatus" use="optional" default="active"/>
50.     <xsd:attribute name="created" type="xsd:dateTime" use="required"/>
51.   </xsd:attributeGroup>
52.   <xsd:complexType name="CT_CommentReply">
53.     <xsd:sequence>
54.       <xsd:group ref="EG_CommentProperties" minOccurs="1" maxOccurs="1"/>
55.     </xsd:sequence>
56.     <xsd:attributeGroup ref="AG_CommentProperties"/>
57.   </xsd:complexType>
58.   <xsd:complexType name="CT_CommentReplyList">
59.     <xsd:sequence>
60.       <xsd:element name="reply" type="CT_CommentReply" minOccurs="0" maxOccurs="unbounded"/>
61.     </xsd:sequence>
62.   </xsd:complexType>
63.   <xsd:complexType name="CT_CommentUnknownAnchor"/>
64.   <xsd:group name="EG_CommentAnchor">
65.     <xsd:choice>
66.       <xsd:element ref="pc:sldMkLst" minOccurs="1" maxOccurs="1"/>
67.       <xsd:element ref="ac:deMkLst" minOccurs="0" maxOccurs="unbounded"/>
68.       <xsd:element ref="ac:txMkLst" minOccurs="0" maxOccurs="unbounded"/>
69.       <xsd:element name="unknownAnchor" type="CT_CommentUnknownAnchor" minOccurs="1" maxOccurs="1"/>
70.     </xsd:choice>
71.   </xsd:group>
72.   <xsd:complexType name="CT_Comment">
73.     <xsd:sequence>
74.       <xsd:group ref="EG_CommentAnchor" minOccurs="1" maxOccurs="1"/>
75.       <xsd:element name="pos" type="a:CT_Point2D" minOccurs="0" maxOccurs="1"/>
76.       <xsd:element name="replyLst" type="CT_CommentReplyList" minOccurs="0" maxOccurs="1"/>
77.       <xsd:group ref="EG_CommentProperties" minOccurs="1" maxOccurs="1"/>
78.     </xsd:sequence>
79.     <xsd:attributeGroup ref="AG_CommentProperties"/>
80.     <xsd:attribute name="startDate" type="xsd:dateTime" use="optional"/>
81.     <xsd:attribute name="dueDate" type="xsd:dateTime" use="optional"/>
82.     <xsd:attribute name="assignedTo" type="ST_AuthorIdList" use="optional" default=""/>
83.     <xsd:attribute name="complete" type="s:ST_PositiveFixedPercentage" default="0%" use="optional"/>
84.     <xsd:attribute name="title" type="xsd:string" use="optional" default=""/>
85.   </xsd:complexType>
86.   <xsd:complexType name="CT_CommentList">
87.     <xsd:sequence>
88.       <xsd:element name="cm" type="CT_Comment" minOccurs="0" maxOccurs="unbounded"/>
89.     </xsd:sequence>
90.   </xsd:complexType>
91.   <xsd:element name="cmLst" type="CT_CommentList"/>
92.   <xsd:complexType name="CT_CommentRelationship">
93.     <xsd:attribute ref="r:id" use="required"/>
94.   </xsd:complexType>
95.   <xsd:element name="commentRel" type="CT_CommentRelationship"/>
96. </xsd:schema>
