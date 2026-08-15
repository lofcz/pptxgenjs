<!-- sourced from [MS-PPTX] v25.0 / 2024-08-20 -->
<!-- heading: http://schemas.microsoft.com/office/powerpoint/2023/02/main Schema -->

## http://schemas.microsoft.com/office/powerpoint/2023/02/main Schema


1. <xsd:schema elementFormDefault="qualified" targetNamespace="http://schemas.microsoft.com/office/powerpoint/2023/02/main" xmlns="http://schemas.microsoft.com/office/powerpoint/2023/02/main" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
2.   <xsd:import namespace="http://schemas.openxmlformats.org/presentationml/2006/main" schemaLocation="pml.xsd"/>
3.   <xsd:complexType name="CT_PlaceholderTypeACB">
4.     <xsd:sequence>
5.       <xsd:choice minOccurs="1" maxOccurs="1">
6.         <xsd:element name="cameo" type="p:CT_Empty"/>
7.         <xsd:element name="unknown" type="p:CT_Empty"/>
8.       </xsd:choice>
9.     </xsd:sequence>
10.   </xsd:complexType>
11.   <xsd:complexType name="CT_PlaceholderTypeExtension">
12.     <xsd:sequence>
13.       <xsd:element name="type" type="CT_PlaceholderTypeACB" minOccurs="1" maxOccurs="1"/>
14.     </xsd:sequence>
15.   </xsd:complexType>
16.   <xsd:element name="phTypeExt" type="CT_PlaceholderTypeExtension"/>
17. </xsd:schema>
