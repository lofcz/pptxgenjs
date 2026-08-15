<!-- sourced from [MS-PPTX] v25.0 / 2024-08-20 -->
<!-- heading: http://schemas.microsoft.com/office/powerpoint/2015/main Schema -->

## http://schemas.microsoft.com/office/powerpoint/2015/main Schema


1. <xsd:schema elementFormDefault="qualified" targetNamespace="http://schemas.microsoft.com/office/powerpoint/2015/main" xmlns="http://schemas.microsoft.com/office/powerpoint/2015/main" xmlns:p16="http://schemas.microsoft.com/office/powerpoint/2015/main" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:s="http://schemas.openxmlformats.org/officeDocument/2006/sharedTypes">
2.   <xsd:import namespace="http://schemas.openxmlformats.org/drawingml/2006/main" schemaLocation="dml-main.xsd"/>
3.   <xsd:import namespace="http://schemas.openxmlformats.org/officeDocument/2006/sharedTypes" schemaLocation="shared-commonSimpleTypes.xsd"/>
4.   <xsd:import namespace="http://schemas.openxmlformats.org/presentationml/2006/main" schemaLocation="pml.xsd"/>
5.   <xsd:complexType name="CT_DesignElement">
6.     <xsd:attribute name="val" type="xsd:boolean"/>
7.   </xsd:complexType>
8.   <xsd:element name="designElem" type="CT_DesignElement"/>
9. </xsd:schema>
