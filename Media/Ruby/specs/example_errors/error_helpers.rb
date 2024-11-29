# frozen_string_literal: true

require './lib/basics'
require './lib/schema'
require './lib/table'
require './lib/ensure_exception'
require './lib/require_exception'

# the helpers mentioned at the top of the file here: https://github.com/brownplt/B2T2/blob/main/Errors.md
module ErrorHelpers
  include Basics

  # scatterPlot :: t:Table * c1:ColName * c2:ColName -> Image
  # rubocop:disable Metrics/AbcSize
  def self.scatter_plot(table, column_1_name, column_2_name)
    # both input columns must contain numbers
    # we assume that a table must be valid and thus each column is really the sort
    # it says it is
    assert_require { table.schema.headers.select { |h| h[:column_name] == column_1_name }.any? }
    assert_require { table.schema.headers.select { |h| h[:column_name] == column_2_name }.any? }

    column1 = table.schema.headers.select { |h| h[:column_name] == column_1_name }[0]
    column2 = table.schema.headers.select { |h| h[:column_name] == column_2_name }[0]
    assert_require { column1[:sort] == Integer || column1[:sort] == Float }
    assert_require { column2[:sort] == Integer || column2[:sort] == Float }
  end
  # rubocop:enable Metrics/AbcSize

  # pieChart :: t:Table * c1:ColName * c2:ColName -> Image
  # where the first column must contain categorical values, and the second column
  # must contain positive numbers.
  # rubocop:disable Metrics/AbcSize
  def self.pie_chart(table, column_1_name, column_2_name)
    assert_require { table.schema.headers.select { |h| h[:column_name] == column_1_name }.any? }
    assert_require { table.schema.headers.select { |h| h[:column_name] == column_2_name }.any? }

    # column1 = table.schema.headers.select { |h| h[:column_name] == column_1_name }[0]
    column2 = table.schema.headers.select { |h| h[:column_name] == column_2_name }[0]
    # TODO: figure out what a categorical value is
    # assert_require { column1[:sort] == Integer || column1[:sort] == Float }
    assert_require { column2[:sort] == Integer || column2[:sort] == Float }
    assert_require { table.get_column_by_name(column_2_name).select(&:negative?).all? }
  end
  # rubocop:enable Metrics/AbcSize

  #### Ensure/Require Helpers ####
  # TODO: don't copy-pasta this everywhere
  # Especially hacky, but it works
  def self.assert_require(&block)
    file_name, line_number = block.source_location
    message = File.readlines(file_name)[line_number - 1].split('assert_require {')[1].split("}\n")[0].strip
    raise RequireException, "[Failed Require]: #{message}" unless block.call
  end
  ####################
end
