<!-- sourced from [MS-OWEXML] v11.0 / 2024-08-20 -->
<!-- heading: http://schemas.microsoft.com/office/webextensions/webextension/2010/11 Schema -->

## http://schemas.microsoft.com/office/webextensions/webextension/2010/11 Schema


1. <xsd:schema targetNamespace="http://schemas.microsoft.com/office/webextensions/webextension/2010/11" elementFormDefault="qualified" attributeFormDefault="unqualified" xmlns="http://schemas.microsoft.com/office/webextensions/webextension/2010/11" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:a14="http://schemas.microsoft.com/office/drawing/2010/main" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:o="urn:schemas-microsoft-com:office:office">
2.   <xsd:import namespace="http://schemas.openxmlformats.org/drawingml/2006/main" schemaLocation="oartbasetypes.xsd"/>
3.   <xsd:import namespace="http://schemas.openxmlformats.org/drawingml/2006/main" schemaLocation="oartspeffects.xsd"/>
4.   <xsd:import namespace="http://schemas.openxmlformats.org/officeDocument/2006/relationships" schemaLocation="orel.xsd"/>
5.   <xsd:complexType name="CT_WebExtensionPartRef">
6.     <xsd:attribute ref="r:id" use="required"/>
7.   </xsd:complexType>
8.   <xsd:complexType name="CT_OsfWebExtensionProperty">
9.     <xsd:attribute name="name" type="xsd:string" use="required"/>
10.     <xsd:attribute name="value" type="xsd:string" use="required"/>
11.   </xsd:complexType>
12.   <xsd:complexType name="CT_OsfWebExtensionPropertyBag">
13.     <xsd:sequence>
14.       <xsd:element name="property" minOccurs="0" maxOccurs="unbounded" type="CT_OsfWebExtensionProperty"/>
15.     </xsd:sequence>
16.   </xsd:complexType>
17.   <xsd:complexType name="CT_OsfWebExtensionBinding">
18.     <xsd:sequence>
19.       <xsd:element name="extLst" type="a:CT_OfficeArtExtensionList" minOccurs="0" maxOccurs="1"/>
20.     </xsd:sequence>
21.     <xsd:attribute name="id" type="xsd:string" use="required"/>
22.     <xsd:attribute name="type" type="xsd:string" use="required"/>
23.     <xsd:attribute name="appref" type="xsd:string" use="required"/>
24.   </xsd:complexType>
25.   <xsd:complexType name="CT_OsfWebExtensionBindingList">
26.     <xsd:sequence>
27.       <xsd:element name="binding" minOccurs="0" maxOccurs="unbounded" type="CT_OsfWebExtensionBinding"/>
28.     </xsd:sequence>
29.   </xsd:complexType>
30.   <xsd:complexType name="CT_OsfWebExtensionReference">
31.     <xsd:sequence>
32.       <xsd:element name="extLst" type="a:CT_OfficeArtExtensionList" minOccurs="0" maxOccurs="1"/>
33.     </xsd:sequence>
34.     <xsd:attribute name="id" type="xsd:string" use="required"/>
35.     <xsd:attribute name="version" type="xsd:string" use="required"/>
36.     <xsd:attribute name="store" type="xsd:string"/>
37.     <xsd:attribute name="storeType" type="xsd:string" use="optional"/>
38.   </xsd:complexType>
39.   <xsd:complexType name="CT_OsfWebExtensionReferenceList">
40.     <xsd:sequence>
41.       <xsd:element name="reference" minOccurs="0" maxOccurs="unbounded" type="CT_OsfWebExtensionReference"/>
42.     </xsd:sequence>
43.   </xsd:complexType>
44.   <xsd:complexType name="CT_ContainsCustomFunctions">
45.     <xsd:attribute name="val" type="xsd:boolean" use="optional" default="false"/>
46.   </xsd:complexType>
47.   <xsd:complexType name="CT_CustomFunctionList">
48.     <xsd:sequence>
49.       <xsd:element name="customFunctionIds" type="xsd:string" minOccurs="0" maxOccurs="unbounded"/>
50.     </xsd:sequence>
51.   </xsd:complexType>
52.   <xsd:complexType name="CT_BackgroundAppData">
53.     <xsd:attribute name="state" type="xsd:int" use="required"/>
54.     <xsd:attribute name="runtimeId" type="xsd:string" use="required"/>
55.   </xsd:complexType>
56.   <xsd:complexType name="CT_OsfWebExtension">
57.     <xsd:sequence>
58.       <xsd:element name="reference" type="CT_OsfWebExtensionReference"/>
59.       <xsd:element name="alternateReferences" type="CT_OsfWebExtensionReferenceList" minOccurs="0" maxOccurs="1"/>
60.       <xsd:element name="properties" type="CT_OsfWebExtensionPropertyBag"/>
61.       <xsd:element name="bindings" type="CT_OsfWebExtensionBindingList"/>
62.       <xsd:element name="snapshot" type="a:CT_Blip" minOccurs="0" maxOccurs="1"/>
63.       <xsd:element name="extLst" type="a:CT_OfficeArtExtensionList" minOccurs="0" maxOccurs="1"/>
64.     </xsd:sequence>
65.     <xsd:attribute name="id" type="xsd:string" use="required"/>
66.     <xsd:attribute name="frozen" type="xsd:boolean" use="optional" default="false"/>
67.   </xsd:complexType>
68.   <xsd:element name="webextension" type="CT_OsfWebExtension"/>
69.   <xsd:element name="webextensionref" type="CT_WebExtensionPartRef"/>
70. </xsd:schema>
