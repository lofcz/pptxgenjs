<!-- sourced from [MS-PPTX] v25.0 / 2024-08-20 -->
<!-- heading: http://schemas.microsoft.com/office/powerpoint/2022/03/main Schema -->

## http://schemas.microsoft.com/office/powerpoint/2022/03/main Schema


1. <xsd:schema elementFormDefault="qualified" targetNamespace="http://schemas.microsoft.com/office/powerpoint/2022/03/main" xmlns="http://schemas.microsoft.com/office/powerpoint/2022/03/main" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:s="http://schemas.openxmlformats.org/officeDocument/2006/sharedTypes" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
2.   <xsd:complexType name="CT_ReactionInstance" xmlns:p188="http://schemas.microsoft.com/office/powerpoint/2018/8/main" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
3.     <xsd:sequence>
4.       <xsd:element name="extLst" type="p:CT_ExtensionList" minOccurs="0" maxOccurs="1"/>
5.     </xsd:sequence>
6.     <xsd:attribute name="time" type="xsd:dateTime" use="required"/>
7.     <xsd:attribute name="authorId" type="p188:ST_AuthorId" use="required"/>
8.   </xsd:complexType>
9.   <xsd:complexType name="CT_Reaction" xmlns:p188="http://schemas.microsoft.com/office/powerpoint/2018/8/main" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
10.     <xsd:sequence>
11.       <xsd:element name="instance" type="CT_ReactionInstance" minOccurs="0" maxOccurs="unbounded"/>
12.     </xsd:sequence>
13.     <xsd:attribute name="type" type="xsd:string" use="required"/>
14.   </xsd:complexType>
15.   <xsd:complexType name="CT_Reactions" xmlns:p188="http://schemas.microsoft.com/office/powerpoint/2018/8/main" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
16.     <xsd:sequence>
17.       <xsd:element name="rxn" type="CT_Reaction" minOccurs="0" maxOccurs="unbounded"/>
18.     </xsd:sequence>
19.   </xsd:complexType>
20.   <xsd:element name="reactions" type="CT_Reactions" xmlns:p188="http://schemas.microsoft.com/office/powerpoint/2018/8/main" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"/>
21. </xsd:schema>
