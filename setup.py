"""Setup for Inline Dropdown Problem XBlock."""

import os
from setuptools import setup


def package_data(pkg, roots):
    """Generic function to find package_data.

    All of the files under each of the `roots` will be declared as package
    data for package `pkg`.

    """
    data = []
    for root in roots:
        for dirname, _, files in os.walk(os.path.join(pkg, root)):
            for fname in files:
                data.append(os.path.relpath(os.path.join(dirname, fname), pkg))

    return {pkg: data}


setup(
    name='xblock-inline-dropdown',
    version='0.2',
    description='Inline Dropdown Problem XBlock',   # TODO: write a better description.
    license='AGPL v3',
    packages=[
        'inline_dropdown',
    ],
    install_requires=[
        'XBlock',
    ],
    entry_points={
        'xblock.v1': [
            'inline-dropdown = inline_dropdown:InlineDropdownXBlock',
        ]
    },
    package_data=package_data("inline_dropdown", ["static", "public", "translations", "templatetags", "locale"]),
)
