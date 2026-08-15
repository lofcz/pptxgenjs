<!-- sourced from [MS-OWEXML] v11.0 / 2024-08-20 -->
<!-- heading: http://schemas.microsoft.com/office/webextensions/taskpanes/2010/11 Schema -->

## http://schemas.microsoft.com/office/webextensions/taskpanes/2010/11 Schema


1. <xsd:schema targetNamespace="http://schemas.microsoft.com/office/webextensions/taskpanes/2010/11" elementFormDefault="qualified" attributeFormDefault="unqualified" xmlns="http://schemas.microsoft.com/office/webextensions/taskpanes/2010/11" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:we="http://schemas.microsoft.com/office/webextensions/webextension/2010/11" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
2.   <xsd:import namespace="http://schemas.microsoft.com/office/webextensions/webextension/2010/11" schemaLocation="osfwebextension.xsd"/>
3.   <xsd:import namespace="http://schemas.openxmlformats.org/drawingml/2006/main" schemaLocation="oartbasetypes.xsd"/>
4.   <xsd:complexType name="CT_OsfTaskpane">
5.     <xsd:sequence>
6.       <xsd:element name="webextensionref" minOccurs="1" maxOccurs="1" type="we:CT_WebExtensionPartRef"/>
7.       <xsd:element name="extLst" type="a:CT_OfficeArtExtensionList" minOccurs="0" maxOccurs="1"/>
8.     </xsd:sequence>
9.     <xsd:attribute name="dockstate" type="xsd:string" use="required"/>
10.     <xsd:attribute name="visibility" type="xsd:boolean" use="required"/>
11.     <xsd:attribute name="width" type="xsd:double" use="required"/>
12.     <xsd:attribute name="row" type="xsd:unsignedInt" use="required"/>
13.     <xsd:attribute name="locked" type="xsd:boolean" use="optional" default="false"/>
14.   </xsd:complexType>
15.   <xsd:complexType name="CT_OsfTaskpanes">
16.     <xsd:sequence>
17.       <xsd:element name="taskpane" minOccurs="0" maxOccurs="unbounded" type="CT_OsfTaskpane"/>
18.     </xsd:sequence>
19.   </xsd:complexType>
20.   <xsd:element name="taskpanes" type="CT_OsfTaskpanes"/>
21. </xsd:schema>
