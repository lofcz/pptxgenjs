<!-- sourced from [MS-PPTX] v25.0 / 2024-08-20 -->
<!-- heading: Slide Transitions -->

## Slide Transitions


The following shows an example of a __ripple __transition (section [2.3.1.24](#Section_c1c9b4f579c04e2f8b59db2b4cee9f00)):

1. <p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" xmlns:p14="http://schemas.microsoft.com/office/powerpoint/2010/main" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006">  
  
...  

2.    <mc:AlternateContent>
3.       <mc:Choice Requires="p14">
4.          <p:transition spd="slow" p14:dur="1500">
5.             <p14:ripple dir="ld"/>
6.          </p:transition>
7.       </mc:Choice>
8.       <mc:Fallback>
9.          <p:transition spd="slow">
10.             <p:fade/>
11.          </p:transition>
12.       </mc:Fallback>
13.    </mc:AlternateContent>  
  
...  

14. </p:sld>

This example shows a __ripple__ slide transition (section 2.3.1.24). The __p14:dur__ (section [2.3.2.3](#Section_9032bdb2b273470b8ac4c98a8c944494)) attribute on the __p:transition__ element ([[ISO/IEC29500-1:2016]](https://go.microsoft.com/fwlink/?linkid=861065) section 19.3.1.50) has a value of 1500 and indicates the transition runs for 1.5 seconds. The __dir__ attribute on the __p14:ripple__ element (section 2.3.1.24) has a value of "ld" and indicates the ripple will be to the left and down.
