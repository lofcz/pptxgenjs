<!-- sourced from [MS-PPTX] v25.0 / 2024-08-20 -->
<!-- heading: http://schemas.microsoft.com/office/powerpoint/2016/sectionzoom Schema -->

## http://schemas.microsoft.com/office/powerpoint/2016/sectionzoom Schema


1. <xsd:schema elementFormDefault="qualified" targetNamespace="http://schemas.microsoft.com/office/powerpoint/2016/sectionzoom" xmlns="http://schemas.microsoft.com/office/powerpoint/2016/sectionzoom" xmlns:psez="http://schemas.microsoft.com/office/powerpoint/2016/sectionzoom" xmlns:p166="http://schemas.microsoft.com/office/powerpoint/2016/6/main" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:s="http://schemas.openxmlformats.org/officeDocument/2006/sharedTypes" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
2.   <xsd:import namespace="http://schemas.microsoft.com/office/powerpoint/2016/6/main" schemaLocation="ms-pptx166.xsd"/>
3.   <xsd:import namespace="http://schemas.openxmlformats.org/officeDocument/2006/sharedTypes" schemaLocation="shared-commonSimpleTypes.xsd"/>
4.   <xsd:import namespace="http://schemas.openxmlformats.org/presentationml/2006/main" schemaLocation="pml.xsd"/>
5.   <xsd:complexType name="CT_SectionZoomObject">
6.     <xsd:sequence>
7.       <xsd:element name="zmPr" type="p166:CT_ZoomObjectProperties" minOccurs="1" maxOccurs="1"/>
8.       <xsd:element name="extLst" type="p:CT_ExtensionList" minOccurs="0" maxOccurs="1"/>
9.     </xsd:sequence>
10.     <xsd:attribute name="sectionId" type="s:ST_Guid" use="required"/>
11.   </xsd:complexType>
12.   <xsd:complexType name="CT_SectionZoom">
13.     <xsd:sequence>
14.       <xsd:element name="sectionZmObj" type="CT_SectionZoomObject" minOccurs="1" maxOccurs="1"/>
15.       <xsd:element name="extLst" type="p:CT_ExtensionList" minOccurs="0" maxOccurs="1"/>
16.     </xsd:sequence>
17.   </xsd:complexType>
18.   <xsd:element name="sectionZm" type="CT_SectionZoom"/>
19. </xsd:schema>
