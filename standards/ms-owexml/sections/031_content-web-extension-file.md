<!-- sourced from [MS-OWEXML] v11.0 / 2024-08-20 -->
<!-- heading: Content Web Extension File -->

## Content Web Extension File


The following example shows the content of a web extension file, as specified in section [2.2.7](#Section_d59d5543252a47dda5661503dbf6a233).

1. <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
2. <we:webextension xmlns:we="http://schemas.microsoft.com/office/webextensions/webextension/2010/11" id="{B1C15FE4-84FA-4773-AD36-9EF5444C5A01}">
3.   <we:reference id="Example1" version="15.0" store="C:\Example" storeType="Filesystem"/>
4.   <we:alternateReferences>
5.     <we:reference id="Example1a" version="15.0" store="en-US" storeType="OMEX"/>
6.   </we:alternateReferences>
7.   <we:properties>
8.     <we:property name="Key2" value="Value2"/>
9.     <we:property name="Key1" value="Value1"/>
10.   </we:properties>
11.   <we:bindings/>
12.   <we:snapshot xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" r:embed="rId1"/>
13. </we:webextension>
