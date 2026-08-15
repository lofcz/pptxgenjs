<!-- sourced from [MS-PPTX] v25.0 / 2024-08-20 -->
<!-- heading: http://schemas.microsoft.com/office/powerpoint/2016/summaryzoom Schema -->

## http://schemas.microsoft.com/office/powerpoint/2016/summaryzoom Schema


1. <xsd:schema elementFormDefault="qualified" targetNamespace="http://schemas.microsoft.com/office/powerpoint/2016/summaryzoom" xmlns="http://schemas.microsoft.com/office/powerpoint/2016/summaryzoom" xmlns:psuz="http://schemas.microsoft.com/office/powerpoint/2016/summaryzoom" xmlns:p166="http://schemas.microsoft.com/office/powerpoint/2016/6/main" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:s="http://schemas.openxmlformats.org/officeDocument/2006/sharedTypes" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
2.   <xsd:import namespace="http://schemas.microsoft.com/office/powerpoint/2016/6/main" schemaLocation="ms-pptx166.xsd"/>
3.   <xsd:import namespace="http://schemas.openxmlformats.org/drawingml/2006/main" schemaLocation="dml-main.xsd"/>
4.   <xsd:import namespace="http://schemas.openxmlformats.org/officeDocument/2006/sharedTypes" schemaLocation="shared-commonSimpleTypes.xsd"/>
5.   <xsd:import namespace="http://schemas.openxmlformats.org/presentationml/2006/main" schemaLocation="pml.xsd"/>
6.   <xsd:complexType name="CT_SummaryZoomObject">
7.     <xsd:sequence>
8.       <xsd:element name="zmPr" type="p166:CT_ZoomObjectProperties" minOccurs="1" maxOccurs="1"/>
9.       <xsd:element name="extLst" type="p:CT_ExtensionList" minOccurs="0" maxOccurs="1"/>
10.     </xsd:sequence>
11.     <xsd:attribute name="sectionId" type="s:ST_Guid" use="required"/>
12.     <xsd:attribute name="title" type="xsd:string" use="optional" default=""/>
13.     <xsd:attribute name="descr" type="xsd:string" use="optional" default=""/>
14.     <xsd:attribute name="offsetFactorX" type="a:ST_Percentage" use="optional" default="0"/>
15.     <xsd:attribute name="offsetFactorY" type="a:ST_Percentage" use="optional" default="0"/>
16.     <xsd:attribute name="scaleFactorX" type="a:ST_Percentage" use="optional" default="100000"/>
17.     <xsd:attribute name="scaleFactorY" type="a:ST_Percentage" use="optional" default="100000"/>
18.   </xsd:complexType>
19.   <xsd:complexType name="CT_GridLayout"/>
20.   <xsd:complexType name="CT_FixedLayout"/>
21.   <xsd:complexType name="CT_SummaryZoom">
22.     <xsd:sequence>
23.       <xsd:element name="summaryZmObj" type="CT_SummaryZoomObject" minOccurs="0" maxOccurs="unbounded"/>
24.       <xsd:choice minOccurs="1" maxOccurs="1">
25.         <xsd:element name="gridLayout" type="CT_GridLayout"/>
26.         <xsd:element name="fixedLayout" type="CT_FixedLayout"/>
27.       </xsd:choice>
28.       <xsd:element name="extLst" type="p:CT_ExtensionList" minOccurs="0" maxOccurs="1"/>
29.     </xsd:sequence>
30.   </xsd:complexType>
31.   <xsd:element name="summaryZm" type="CT_SummaryZoom"/>
32. </xsd:schema>
