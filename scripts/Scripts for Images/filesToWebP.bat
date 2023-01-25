for /r %%f in (images/*.webp) do cwebp -q 60 images/%%~nxf -o conv/%%~nxf
cmd /k