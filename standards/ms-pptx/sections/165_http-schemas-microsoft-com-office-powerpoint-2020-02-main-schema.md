<!-- sourced from [MS-PPTX] v25.0 / 2024-08-20 -->
<!-- heading: http://schemas.microsoft.com/office/powerpoint/2020/02/main Schema -->

## http://schemas.microsoft.com/office/powerpoint/2020/02/main Schema


1. <xsd:schema elementFormDefault="qualified" targetNamespace="http://schemas.microsoft.com/office/powerpoint/2020/02/main" xmlns="http://schemas.microsoft.com/office/powerpoint/2020/02/main" xmlns:p202="http://schemas.microsoft.com/office/powerpoint/2020/02/main" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" xmlns:s="http://schemas.openxmlformats.org/officeDocument/2006/sharedTypes" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
2.   <xsd:import namespace="http://schemas.openxmlformats.org/drawingml/2006/main" schemaLocation="dml-main.xsd"/>
3.   <xsd:import namespace="http://schemas.openxmlformats.org/officeDocument/2006/sharedTypes" schemaLocation="shared-commonSimpleTypes.xsd"/>
4.   <xsd:import namespace="http://schemas.openxmlformats.org/presentationml/2006/main" schemaLocation="pml.xsd"/>
5.   <xsd:complexType name="CT_DesignerTag">
6.     <xsd:attribute name="name" type="xsd:string" use="required"/>
7.     <xsd:attribute name="val" type="xsd:string" use="required"/>
8.   </xsd:complexType>
9.   <xsd:complexType name="CT_DesignerTagList">
10.     <xsd:sequence>
11.       <xsd:element name="designTag" type="CT_DesignerTag" minOccurs="0" maxOccurs="unbounded"/>
12.     </xsd:sequence>
13.   </xsd:complexType>
14.   <xsd:element name="designTagLst" type="CT_DesignerTagList"/>
15.   <xsd:complexType name="CT_DesignerDrawingProps">
16.     <xsd:sequence>
17.       <xsd:element ref="p202:designTagLst" minOccurs="0" maxOccurs="1"/>
18.       <xsd:element name="extLst" type="p:CT_ExtensionList" minOccurs="0" maxOccurs="1"/>
19.     </xsd:sequence>
20.     <xsd:attribute name="edtDesignElem" type="xsd:boolean" use="optional" default="false"/>
21.   </xsd:complexType>
22.   <xsd:element name="designPr" type="CT_DesignerDrawingProps"/>
23. </xsd:schema>
