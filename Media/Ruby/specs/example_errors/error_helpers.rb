require './lib/ensure_exception'
require './lib/require_exception'

module ErrorHelpers
  # scatterPlot :: t:Table * c1:ColName * c2:ColName -> Image
  def self.scatter_plot(table, column_1, column_2)
    # both input columns must contain numbers
    assert_require {  }
  end

  # pieChart :: t:Table * c1:ColName * c2:ColName -> Image
  # where the first column must contain categorical values, and the second column
  # must contain positive numbers.
  def self.pie_chart
  end
end