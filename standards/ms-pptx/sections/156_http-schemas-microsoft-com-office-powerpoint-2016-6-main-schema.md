<!-- sourced from [MS-PPTX] v25.0 / 2024-08-20 -->
<!-- heading: http://schemas.microsoft.com/office/powerpoint/2016/6/main Schema -->

## http://schemas.microsoft.com/office/powerpoint/2016/6/main Schema


1. <xsd:schema elementFormDefault="qualified" targetNamespace="http://schemas.microsoft.com/office/powerpoint/2016/6/main" xmlns="http://schemas.microsoft.com/office/powerpoint/2016/6/main" xmlns:p166="http://schemas.microsoft.com/office/powerpoint/2016/6/main" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" xmlns:p14="http://schemas.microsoft.com/office/powerpoint/2010/main" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:s="http://schemas.openxmlformats.org/officeDocument/2006/sharedTypes" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
2.   <xsd:import namespace="http://schemas.microsoft.com/office/powerpoint/2010/main" schemaLocation="ms-pptx14.xsd"/>
3.   <xsd:import namespace="http://schemas.openxmlformats.org/drawingml/2006/main" schemaLocation="dml-main.xsd"/>
4.   <xsd:import namespace="http://schemas.openxmlformats.org/officeDocument/2006/sharedTypes" schemaLocation="shared-commonSimpleTypes.xsd"/>
5.   <xsd:import namespace="http://schemas.openxmlformats.org/presentationml/2006/main" schemaLocation="pml.xsd"/>
6.   <xsd:simpleType name="ST_ZoomObjectImageType">
7.     <xsd:restriction base="xsd:token">
8.       <xsd:enumeration value="preview"/>
9.       <xsd:enumeration value="cover"/>
10.     </xsd:restriction>
11.   </xsd:simpleType>
12.   <xsd:complexType name="CT_ZoomObjectProperties">
13.     <xsd:sequence>
14.       <xsd:element name="blipFill" type="a:CT_BlipFillProperties" minOccurs="1" maxOccurs="1"/>
15.       <xsd:element name="spPr" type="a:CT_ShapeProperties" minOccurs="1" maxOccurs="1"/>
16.     </xsd:sequence>
17.     <xsd:attribute name="id" type="s:ST_Guid" use="required"/>
18.     <xsd:attribute name="returnToParent" type="xsd:boolean" use="optional" default="true"/>
19.     <xsd:attribute name="imageType" type="ST_ZoomObjectImageType" use="optional" default="preview"/>
20.     <xsd:attribute name="transitionDur" type="p14:ST_UniversalTimeOffset" use="optional"/>
21.     <xsd:attribute name="showBg" type="xsd:boolean" use="optional" default="true"/>
22.   </xsd:complexType>
23. </xsd:schema>
