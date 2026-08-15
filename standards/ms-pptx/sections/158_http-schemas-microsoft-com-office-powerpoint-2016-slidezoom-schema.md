<!-- sourced from [MS-PPTX] v25.0 / 2024-08-20 -->
<!-- heading: http://schemas.microsoft.com/office/powerpoint/2016/slidezoom Schema -->

## http://schemas.microsoft.com/office/powerpoint/2016/slidezoom Schema


1. <xsd:schema elementFormDefault="qualified" targetNamespace="http://schemas.microsoft.com/office/powerpoint/2016/slidezoom" xmlns="http://schemas.microsoft.com/office/powerpoint/2016/slidezoom" xmlns:pslz="http://schemas.microsoft.com/office/powerpoint/2016/slidezoom" xmlns:p166="http://schemas.microsoft.com/office/powerpoint/2016/6/main" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" xmlns:s="http://schemas.openxmlformats.org/officeDocument/2006/sharedTypes" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
2.   <xsd:import namespace="http://schemas.microsoft.com/office/powerpoint/2016/6/main" schemaLocation="ms-pptx166.xsd"/>
3.   <xsd:import namespace="http://schemas.openxmlformats.org/officeDocument/2006/sharedTypes" schemaLocation="shared-commonSimpleTypes.xsd"/>
4.   <xsd:import namespace="http://schemas.openxmlformats.org/presentationml/2006/main" schemaLocation="pml.xsd"/>
5.   <xsd:complexType name="CT_SlideZoomObject">
6.     <xsd:sequence>
7.       <xsd:element name="zmPr" type="p166:CT_ZoomObjectProperties" minOccurs="1" maxOccurs="1"/>
8.       <xsd:element name="extLst" type="p:CT_ExtensionList" minOccurs="0" maxOccurs="1"/>
9.     </xsd:sequence>
10.     <xsd:attribute name="sldId" type="p:ST_SlideId" use="required"/>
11.     <xsd:attribute name="cId" type="xsd:unsignedInt" use="optional"/>
12.   </xsd:complexType>
13.   <xsd:complexType name="CT_SlideZoom">
14.     <xsd:sequence>
15.       <xsd:element name="sldZmObj" type="CT_SlideZoomObject" minOccurs="1" maxOccurs="1"/>
16.       <xsd:element name="extLst" type="p:CT_ExtensionList" minOccurs="0" maxOccurs="1"/>
17.     </xsd:sequence>
18.   </xsd:complexType>
19.   <xsd:element name="sldZm" type="CT_SlideZoom"/>
20. </xsd:schema>
