<!-- sourced from [MS-PPTX] v25.0 / 2024-08-20 -->
<!-- heading: http://schemas.microsoft.com/office/powerpoint/2012/main Schema -->

## http://schemas.microsoft.com/office/powerpoint/2012/main Schema


1. <xsd:schema elementFormDefault="qualified" targetNamespace="http://schemas.microsoft.com/office/powerpoint/2012/main" xmlns="http://schemas.microsoft.com/office/powerpoint/2012/main" xmlns:p14="http://schemas.microsoft.com/office/powerpoint/2010/main" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:s="http://schemas.openxmlformats.org/officeDocument/2006/sharedTypes" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
2.   <xsd:import namespace="http://schemas.openxmlformats.org/drawingml/2006/main" schemaLocation="dml-main.xsd"/>
3.   <xsd:import namespace="http://schemas.openxmlformats.org/officeDocument/2006/sharedTypes" schemaLocation="shared-commonSimpleTypes.xsd"/>
4.   <xsd:import namespace="http://schemas.openxmlformats.org/presentationml/2006/main" schemaLocation="pml.xsd"/>
5.   <xsd:complexType name="CT_PresetTransition" xmlns:p15="http://schemas.microsoft.com/office/powerpoint/2012/main">
6.     <xsd:attribute name="prst" type="xsd:string"/>
7.     <xsd:attribute name="invX" type="xsd:boolean" use="optional" default="false"/>
8.     <xsd:attribute name="invY" type="xsd:boolean" use="optional" default="false"/>
9.   </xsd:complexType>
10.   <xsd:element name="prstTrans" type="CT_PresetTransition" xmlns:p15="http://schemas.microsoft.com/office/powerpoint/2012/main"/>
11.   <xsd:complexType name="CT_PresenceInfo">
12.     <xsd:attribute name="userId" type="xsd:string" use="required"/>
13.     <xsd:attribute name="providerId" type="xsd:string" use="required"/>
14.   </xsd:complexType>
15.   <xsd:complexType name="CT_ParentCommentIdentifier">
16.     <xsd:attribute name="authorId" type="xsd:unsignedInt"/>
17.     <xsd:attribute name="idx" type="xsd:unsignedInt"/>
18.   </xsd:complexType>
19.   <xsd:complexType name="CT_CommentThreading">
20.     <xsd:sequence>
21.       <xsd:element name="parentCm" type="CT_ParentCommentIdentifier" minOccurs="0" maxOccurs="1"/>
22.     </xsd:sequence>
23.     <xsd:attribute name="timeZoneBias" type="xsd:int"/>
24.   </xsd:complexType>
25.   <xsd:element name="presenceInfo" type="CT_PresenceInfo"/>
26.   <xsd:element name="threadingInfo" type="CT_CommentThreading"/>
27.   <xsd:complexType name="CT_ExtendedGuide">
28.     <xsd:sequence>
29.       <xsd:element name="clr" type="a:CT_Color" minOccurs="1" maxOccurs="1"/>
30.       <xsd:element name="extLst" type="p:CT_ExtensionList" minOccurs="0" maxOccurs="1"/>
31.     </xsd:sequence>
32.     <xsd:attribute name="id" type="xsd:unsignedInt" use="required"/>
33.     <xsd:attribute name="name" type="xsd:string" use="optional" default=""/>
34.     <xsd:attribute name="orient" type="p:ST_Direction" use="optional" default="vert"/>
35.     <xsd:attribute name="pos" type="a:ST_Coordinate32" use="optional" default="0"/>
36.     <xsd:attribute name="userDrawn" type="xsd:boolean" use="optional" default="false"/>
37.   </xsd:complexType>
38.   <xsd:complexType name="CT_ExtendedGuideList">
39.     <xsd:sequence>
40.       <xsd:element name="guide" type="CT_ExtendedGuide" minOccurs="0" maxOccurs="unbounded"/>
41.       <xsd:element name="extLst" type="p:CT_ExtensionList" minOccurs="0" maxOccurs="1"/>
42.     </xsd:sequence>
43.   </xsd:complexType>
44.   <xsd:element name="sldGuideLst" type="CT_ExtendedGuideList"/>
45.   <xsd:element name="notesGuideLst" type="CT_ExtendedGuideList"/>
46.   <xsd:complexType name="CT_ChartTrackingRefBased">
47.     <xsd:attribute name="val" type="xsd:boolean" use="required"/>
48.   </xsd:complexType>
49.   <xsd:element name="chartTrackingRefBased" type="CT_ChartTrackingRefBased"/>
50.   <xsd:complexType name="CT_IsNarration" xmlns:p15="http://schemas.microsoft.com/office/powerpoint/2012/main">
51.     <xsd:attribute name="val" type="xsd:boolean" use="optional" default="false"/>
52.   </xsd:complexType>
53.   <xsd:element name="isNarration" type="CT_IsNarration" xmlns:p15="http://schemas.microsoft.com/office/powerpoint/2012/main"/>
54. </xsd:schema>
